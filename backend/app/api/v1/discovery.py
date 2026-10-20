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
