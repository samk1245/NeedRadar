from typing import Optional, Dict, Any, List
import json
from app.core.config import settings

class BaseAIService:
    def classify_request(self, text: str) -> Dict[str, Any]:
        raise NotImplementedError
        
    def summarize_report(self, text: str) -> str:
        raise NotImplementedError

    def explain_duplicate_match(self, need1_title: str, need2_title: str, similarity_score: float) -> str:
        raise NotImplementedError

class RuleBasedAIService(BaseAIService):
    """
    Deterministic rule-based AI engine that functions without external keys or network calls.
    Always reliable, offline, and completely free.
    """
    CATEGORY_KEYWORDS = {
        "education": ["tutor", "tuition", "school", "books", "student", "class", "study", "exam", "college", "learning"],
        "healthcare": ["doctor", "medicine", "hospital", "clinic", "blood", "patient", "ambulance", "health", "oxygen", "nurse"],
        "supplies": ["ration", "food", "groceries", "water", "meal", "blanket", "clothes", "essentials", "aid", "donation"],
        "infrastructure": ["road", "pothole", "street", "light", "drain", "waterlogging", "footpath", "garbage", "pedestrian", "bridge"],
        "repairs": ["plumber", "electrician", "leak", "pipe", "wiring", "fan", "meter", "carpenter", "roof", "repair"],
        "shelter": ["homeless", "shelter", "stay", "night", "roof", "housing", "eviction", "refuge", "displaced"]
    }

    def classify_request(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        scores = {}
        for cat, kws in self.CATEGORY_KEYWORDS.items():
            matches = sum(1 for kw in kws if kw in text_lower)
            if matches > 0:
                scores[cat] = matches

        if scores:
            best_cat = max(scores, key=scores.get)
            confidence = min(0.95, 0.5 + (scores[best_cat] * 0.15))
        else:
            best_cat = "supplies"
            confidence = 0.50

        # Urgency detection
        urgency = "medium"
        critical_kws = ["immediately", "emergency", "urgent", "critical", "blood", "danger", "today", "now"]
        if any(kw in text_lower for kw in critical_kws):
            urgency = "high"

        return {
            "suggested_category": best_cat,
            "confidence": round(confidence, 2),
            "suggested_urgency": urgency,
            "is_rule_based": True
        }

    def summarize_report(self, text: str) -> str:
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        if not sentences:
            return text[:150]
        summary = sentences[0]
        if len(sentences) > 1 and len(summary) < 80:
            summary += f". {sentences[1]}"
        return summary + "."

    def explain_duplicate_match(self, need1_title: str, need2_title: str, similarity_score: float) -> str:
        score_pct = int(similarity_score * 100)
        return f"Reports share a {score_pct}% match in core requirements and geographic location."

# Singleton or factory
def get_ai_service() -> BaseAIService:
    # If external provider is configured in future, plug here; default to solid deterministic rule-based engine
    return RuleBasedAIService()
