
ITEM = {
    "item_name": "Black Water Bottle",
    "report_type": "Lost",
    "category": "Accessories",
    "description": "Black insulated bottle with silver cap",
    "location": "College library",
    "incident_date": "2026-10-26",
}


def test_create_item_success(client, auth_headers):
    response = client.post(
        "/api/items",
        json=ITEM,
        headers=auth_headers,
    )

    assert response.status_code == 201

    item = response.get_json()["item"]
    assert item["item_name"] == "Black Water Bottle"
    assert item["status"] == "Open"


def test_create_item_without_token(client):
    response = client.post("/api/items", json=ITEM)

    assert response.status_code == 401


def test_search_items(client, auth_headers):
    client.post("/api/items", json=ITEM, headers=auth_headers)

    response = client.get("/api/items?q=bottle")

    assert response.status_code == 200
    assert response.get_json()["count"] == 1


def test_filter_items_by_type(client, auth_headers):
    client.post("/api/items", json=ITEM, headers=auth_headers)

    response = client.get("/api/items?type=Found")

    assert response.status_code == 200
    assert response.get_json()["count"] == 0


def test_invalid_report_type(client, auth_headers):
    invalid_item = {
        **ITEM,
        "report_type": "Missing",
    }

    response = client.post(
        "/api/items",
        json=invalid_item,
        headers=auth_headers,
    )

    assert response.status_code == 400

def test_get_item_details(client, auth_headers):
    create_response = client.post(
        "/api/items",
        json=ITEM,
        headers=auth_headers,
    )

    item_id = create_response.get_json()["item"]["id"]

    response = client.get(f"/api/items/{item_id}")

    assert response.status_code == 200
    assert response.get_json()["item"]["id"] == item_id
    assert response.get_json()["item"]["item_name"] == ITEM["item_name"]


def test_my_items_returns_own_reports(client, auth_headers):
    client.post("/api/items", json=ITEM, headers=auth_headers)

    response = client.get("/api/items/mine", headers=auth_headers)

    assert response.status_code == 200
    assert response.get_json()["count"] == 1
    assert response.get_json()["items"][0]["item_name"] == ITEM["item_name"]


def test_resolve_own_item(client, auth_headers):
    create_response = client.post(
        "/api/items",
        json=ITEM,
        headers=auth_headers,
    )

    item_id = create_response.get_json()["item"]["id"]

    response = client.patch(
        f"/api/items/{item_id}/resolve",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.get_json()["item"]["status"] == "Resolved"


def test_user_cannot_resolve_another_users_item(client, auth_headers):
    create_response = client.post(
        "/api/items",
        json=ITEM,
        headers=auth_headers,
    )

    item_id = create_response.get_json()["item"]["id"]

    # Register a second user.
    register_response = client.post(
        "/api/auth/register",
        json={
            "name": "Second Student",
            "email": "student2@example.com",
            "password": "CampusTest456!",
        },
    )
    assert register_response.status_code == 201

    # Log in as the second user.
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "student2@example.com",
            "password": "CampusTest456!",
        },
    )

    second_token = login_response.get_json()["access_token"]
    second_headers = {
        "Authorization": f"Bearer {second_token}"
    }

    response = client.patch(
        f"/api/items/{item_id}/resolve",
        headers=second_headers,
    )

    assert response.status_code == 403

    # Confirm the original report remains open.
    detail_response = client.get(f"/api/items/{item_id}")

    assert detail_response.status_code == 200
    assert detail_response.get_json()["item"]["status"] == "Open"