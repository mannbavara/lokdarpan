from fastapi.testclient import TestClient


def test_read_user_me(client: TestClient, token_headers, test_user):
    """Test getting current user information."""
    response = client.get("/api/v1/users/me", headers=token_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["id"] == str(test_user.id)
    assert "hashed_password" not in data  # Ensure password is not exposed


def test_read_user_me_unauthorized(client: TestClient):
    """Test getting current user without authentication."""
    response = client.get("/api/v1/users/me")

    assert response.status_code == 401


def test_read_user_me_invalid_token(client: TestClient):
    """Test getting current user with invalid token."""
    response = client.get("/api/v1/users/me", headers={"Authorization": "Bearer invalid_token"})

    assert response.status_code == 403
