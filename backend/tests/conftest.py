import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from app.main import app
from app.core.security import create_access_token

TEST_DB_URL = "sqlite:///./test_needradar.db"

engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers(db_session):
    from app.models.user import User, UserRole
    from app.core.security import get_password_hash
    user = db_session.query(User).filter(User.email == "test_resident@needradar.org").first()
    if not user:
        user = User(
            email="test_resident@needradar.org",
            hashed_password=get_password_hash("Secret123!"),
            full_name="Test Resident",
            role=UserRole.RESIDENT,
            city="Bengaluru",
            preferred_locality="Koramangala",
            is_active=True,
            is_verified=True
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

    token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers(db_session):
    from app.models.user import User, UserRole
    from app.core.security import get_password_hash
    user = db_session.query(User).filter(User.email == "test_admin@needradar.org").first()
    if not user:
        user = User(
            email="test_admin@needradar.org",
            hashed_password=get_password_hash("Secret123!"),
            full_name="Test Admin",
            role=UserRole.ADMIN,
            city="Bengaluru",
            is_active=True,
            is_verified=True
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

    token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {token}"}
