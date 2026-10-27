
import pytest

from app import create_app, db


@pytest.fixture()
def app():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-only-secret-key-at-least-32-bytes-long",
    })

    with app.app_context():
        db.drop_all()
        db.create_all()

    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def auth_headers(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Test Student",
            "email": "student1@example.com",
            "password": "CampusTest123!",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "student1@example.com",
            "password": "CampusTest123!",
        },
    )

    token = response.get_json()["access_token"]

    return {"Authorization": f"Bearer {token}"}
