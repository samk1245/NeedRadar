import re
import math
from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.need import Need, NeedStatus
from app.core.database import haversine_distance_km

def tokenize(text: str) -> set[str]:
    # Normalise words, remove punctuation, lowercase
    words = re.findall(r'\b[a-z0-9]{3,}\b', text.lower())
    # Exclude common stop words
    stop_words = {'the', 'and', 'for', 'with', 'need', 'needs', 'urgent', 'please', 'help', 'area', 'near'}
    return {w for w in words if w not in stop_words}

def text_similarity(text1: str, text2: str) -> float:
    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)
    if not tokens1 or not tokens2:
        return 0.0
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    return len(intersection) / len(union)

def detect_duplicate_candidates(
    db: Session,
    title: str,
    description: str,
    category: str,
    latitude: float,
    longitude: float,
    locality: str,
    exclude_need_id: str = None,
    threshold: float = 0.45,
    limit: int = 5
) -> List[dict]:
    """
    Finds potential duplicates using multi-factor deterministic scoring:
    - Text overlap (Jaccard similarity on title + description)
    - Geographic proximity (Haversine distance in km)
    - Category match
    """
    # Query unresolved needs in the same city or category
    query = db.query(Need).filter(
        Need.status.notin_([NeedStatus.REJECTED, NeedStatus.CLOSED])
    )
    if exclude_need_id:
        query = query.filter(Need.id != exclude_need_id)
        
    candidates = query.limit(200).all()
    results = []
    
    query_text = f"{title} {description}"

    for candidate in candidates:
        # 1. Category match factor
        cat_match = 1.0 if candidate.category.value == category else 0.2
        
        # 2. Text similarity
        cand_text = f"{candidate.title} {candidate.description}"
        txt_sim = text_similarity(query_text, cand_text)
        title_sim = text_similarity(title, candidate.title)
        
        # 3. Distance factor
        dist_km = haversine_distance_km(latitude, longitude, candidate.latitude, candidate.longitude) or 50.0
        
        # Distance weight: within 1km -> 1.0, 5km -> 0.5, >10km -> 0.1
        geo_score = max(0.0, 1.0 - (dist_km / 10.0))
        
        # Locality exact string match boost
        if locality.lower() in candidate.locality.lower() or candidate.locality.lower() in locality.lower():
            geo_score = min(1.0, geo_score + 0.3)
            
        # Composite similarity score (0.0 to 1.0)
        composite = (title_sim * 0.45) + (txt_sim * 0.25) + (geo_score * 0.20) + (cat_match * 0.10)
        
        if composite >= threshold:
            reason_parts = []
            if title_sim > 0.4:
                reason_parts.append("High title similarity")
            if dist_km < 2.0:
                reason_parts.append(f"Located within {dist_km:.1f} km")
            elif locality.lower() == candidate.locality.lower():
                reason_parts.append(f"Same locality ({candidate.locality})")
            if candidate.category.value == category:
                reason_parts.append("Same category")
                
            results.append({
                "id": candidate.id,
                "title": candidate.title,
                "category": candidate.category,
                "locality": candidate.locality,
                "similarity_score": round(composite, 2),
                "distance_km": round(dist_km, 2) if dist_km else None,
                "reason": " • ".join(reason_parts) if reason_parts else "Similar content and area",
                "status": candidate.status
            })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:limit]
