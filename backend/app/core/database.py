import math
import sqlite3
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

# Custom haversine distance function for SQLite
def haversine_distance_km(lat1, lon1, lat2, lon2):
    if any(v is None for v in (lat1, lon1, lat2, lon2)):
        return None
    try:
        r = 6371.0 # Earth radius in km
        phi1, phi2 = math.radians(float(lat1)), math.radians(float(lat2))
        delta_phi = math.radians(float(lat2) - float(lat1))
        delta_lambda = math.radians(float(lon2) - float(lon1))
        a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return r * c
    except Exception:
        return None

if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def on_connect(dbapi_con, con_record):
        if isinstance(dbapi_con, sqlite3.Connection):
            dbapi_con.create_function("haversine_km", 4, haversine_distance_km)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
