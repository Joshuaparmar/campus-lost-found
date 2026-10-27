
def test_register_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 201
    assert response.get_json()["user"]["email"] == "alice@example.com"


def test_duplicate_registration(client):
    payload = {
        "name": "Alice",
        "email": "alice@example.com",
        "password": "SecurePass123!",
    }

    first = client.post("/api/auth/register", json=payload)
    second = client.post("/api/auth/register", json=payload)

    assert first.status_code == 201
    assert second.status_code == 409


def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "password": "SecurePass123!",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "alice@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 200
    assert response.get_json()["access_token"]


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "password": "SecurePass123!",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "alice@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_protected_endpoint_without_token(client):
    response = client.get("/api/auth/me")

    assert response.status_code == 401
