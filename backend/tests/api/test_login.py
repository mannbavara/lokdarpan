from fastapi.testclient import TestClient


def test_login_access_token(client: TestClient, test_user):
    """Test successful login with valid credentials."""
    response = client.post("/api/v1/login/access-token", data={"username": "test@example.com", "password": "password"})

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials(client: TestClient, test_user):
    """Test login with invalid password."""
    response = client.post(
        "/api/v1/login/access-token", data={"username": "test@example.com", "password": "wrongpassword"}
    )

    assert response.status_code == 400
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    """Test login with non-existent user."""
    response = client.post(
        "/api/v1/login/access-token", data={"username": "nonexistent@example.com", "password": "password"}
    )

    assert response.status_code == 400


def test_test_token(client: TestClient, token_headers, test_user):
    """Test the test-token endpoint with valid token."""
    response = client.post("/api/v1/login/test-token", headers=token_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email


def test_test_token_invalid(client: TestClient):
    """Test the test-token endpoint with invalid token."""
    response = client.post("/api/v1/login/test-token", headers={"Authorization": "Bearer invalid_token"})

    assert response.status_code == 403
