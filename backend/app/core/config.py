import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    PROJECT_NAME: str = "NeedRadar"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "needradar-super-secure-production-ready-jwt-secret-key-32chars-min")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./needradar.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # City deployment config
    DEFAULT_CITY: str = "Bengaluru"
    DEFAULT_LAT: float = 12.9716
    DEFAULT_LON: float = 77.5946
    
    # AI Engine settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "deterministic") # 'deterministic', 'openai', 'gemini'
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    
    # Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = 5

settings = Settings()
