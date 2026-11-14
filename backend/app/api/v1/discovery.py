from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db, haversine_distance_km
from app.models.need import Need, NeedCategory, NeedStatus
from app.schemas.need import NeedMapItem
from app.schemas.analytics import DemandClusterItem, EmergingTrendItem
from app.services.demand_intelligence import get_demand_clusters, detect_emerging_trends
from app.core.cities import CITIES_REGISTRY

router = APIRouter()

@router.get("/cities", response_model=List[Dict[str, Any]])
def get_supported_cities():
    """
    Returns list of configured cities with center coordinates, default zoom, and known localities.
    """
    return list(CITIES_REGISTRY.values())

@router.get("/map", response_model=List[NeedMapItem])
def get_map_markers(
    city: Optional[str] = "Bengaluru",
    category: Optional[NeedCategory] = None,
    status: Optional[NeedStatus] = None,
    locality: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Need)
    if city:
        query = query.filter(Need.city == city)
    if category:
        query = query.filter(Need.category == category)
    if status:
        query = query.filter(Need.status == status)
    else:
        # Filter out rejected
        query = query.filter(Need.status.notin_([NeedStatus.REJECTED]))
    if locality:
        query = query.filter(Need.locality.ilike(f"%{locality}%"))

    needs = query.limit(300).all()

    items = []
    for n in needs:
        # Obfuscate coordinates if sensitive or approximate
        lat = n.approx_latitude if (n.is_location_approximate and n.approx_latitude) else n.latitude
        lon = n.approx_longitude if (n.is_location_approximate and n.approx_longitude) else n.longitude
        
        reqs = n.requirements or []
        req_count = len(reqs)
        fulfilled_count = sum(1 for r in reqs if isinstance(r, dict) and (r.get("is_fulfilled") or r.get("pledged_quantity", 0) >= r.get("required_quantity", 1)))
        fulfilled_pct = round((fulfilled_count / req_count) * 100) if req_count > 0 else 0

        items.append(NeedMapItem(
            id=n.id,
            title=n.title,
            category=n.category,
            locality=n.locality,
            city=n.city,
            latitude=lat,
            longitude=lon,
            is_location_approximate=n.is_location_approximate,
            urgency=n.urgency,
            status=n.status,
            supporters_count=n.supporters_count,
            unmet_demand_score=n.unmet_demand_score,
            requirements_count=req_count,
            fulfilled_percent=fulfilled_pct,
            created_at=n.created_at
        ))
    return items

@router.get("/nearby", response_model=List[NeedMapItem])
def get_nearby_needs(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(5.0, ge=0.5, le=50.0),
    category: Optional[NeedCategory] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Need).filter(Need.status.notin_([NeedStatus.REJECTED, NeedStatus.CLOSED]))
    if category:
        query = query.filter(Need.category == category)
        
    candidates = query.limit(200).all()
    results = []
    for n in candidates:
        d = haversine_distance_km(lat, lon, n.latitude, n.longitude)
        if d is not None and d <= radius_km:
            reqs = n.requirements or []
            req_count = len(reqs)
            fulfilled_count = sum(1 for r in reqs if isinstance(r, dict) and (r.get("is_fulfilled") or r.get("pledged_quantity", 0) >= r.get("required_quantity", 1)))
            fulfilled_pct = round((fulfilled_count / req_count) * 100) if req_count > 0 else 0
            results.append(NeedMapItem(
                id=n.id,
                title=n.title,
                category=n.category,
                locality=n.locality,
                city=n.city,
                latitude=n.latitude,
                longitude=n.longitude,
                is_location_approximate=n.is_location_approximate,
                urgency=n.urgency,
                status=n.status,
                supporters_count=n.supporters_count,
                unmet_demand_score=n.unmet_demand_score,
                requirements_count=req_count,
                fulfilled_percent=fulfilled_pct,
                created_at=n.created_at
            ))
    return results

@router.get("/clusters", response_model=List[DemandClusterItem])
def get_clusters(
    city: str = "Bengaluru",
    db: Session = Depends(get_db)
):
    return get_demand_clusters(db, city=city)

@router.get("/trending", response_model=List[EmergingTrendItem])
def get_trending(
    city: str = "Bengaluru",
    db: Session = Depends(get_db)
):
    return detect_emerging_trends(db, city=city)

@router.get("/export")
def export_civic_data(
    city: Optional[str] = None,
    category: Optional[NeedCategory] = None,
    format: str = Query("geojson", pattern="^(geojson|json)$"),
    db: Session = Depends(get_db)
):
    """
    Open Civic Data Exchange: Exports verified community needs in standard GeoJSON
    or JSON for municipal GIS systems, civic researchers, and open-source contributors.
    """
    query = db.query(Need).filter(Need.status.notin_([NeedStatus.REJECTED]))
    if city and city.lower() != "all":
        query = query.filter(Need.city == city)
    if category:
        query = query.filter(Need.category == category)

    needs = query.limit(1000).all()

    if format == "geojson":
        features = []
        for n in needs:
            lat = n.approx_latitude if (n.is_location_approximate and n.approx_latitude) else n.latitude
            lon = n.approx_longitude if (n.is_location_approximate and n.approx_longitude) else n.longitude
            reqs = n.requirements or []
            fulfilled_count = sum(1 for r in reqs if isinstance(r, dict) and (r.get("is_fulfilled") or r.get("pledged_quantity", 0) >= r.get("required_quantity", 1)))
            fulfilled_pct = round((fulfilled_count / len(reqs)) * 100) if reqs else 0

            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "properties": {
                    "id": n.id,
                    "title": n.title,
                    "category": n.category.value if hasattr(n.category, "value") else str(n.category),
                    "urgency": n.urgency.value if hasattr(n.urgency, "value") else str(n.urgency),
                    "status": n.status.value if hasattr(n.status, "value") else str(n.status),
                    "city": n.city,
                    "locality": n.locality,
                    "affected_count": n.affected_count,
                    "supporters_count": n.supporters_count,
                    "unmet_demand_score": n.unmet_demand_score,
                    "requirements_count": len(reqs),
                    "fulfilled_percent": fulfilled_pct,
                    "created_at": n.created_at.isoformat() if n.created_at else None
                }
            })

        return {
            "type": "FeatureCollection",
            "metadata": {
                "generated_by": "NeedRadar Open Civic Data API",
                "city_filter": city or "All Cities (Pan-India)",
                "total_records": len(features),
                "license": "Open Data Commons / CC-BY-4.0",
                "crs": "urn:ogc:def:crs:OGC:1.3:CRS84"
            },
            "features": features
        }

    # Standard JSON format
    return [
        {
            "id": n.id,
            "title": n.title,
            "category": n.category.value if hasattr(n.category, "value") else str(n.category),
            "urgency": n.urgency.value if hasattr(n.urgency, "value") else str(n.urgency),
            "city": n.city,
            "locality": n.locality,
            "latitude": n.latitude,
            "longitude": n.longitude,
            "unmet_demand_score": n.unmet_demand_score,
            "supporters_count": n.supporters_count
        }
        for n in needs
    ]

