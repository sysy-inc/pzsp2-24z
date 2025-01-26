from fastapi.testclient import TestClient

from src.backend.app import app
from tests.api_tests.conftest import (
    call_no_params,
    get_auth_token,
    postgres_db_fixture,
    register_user,
)

client = TestClient(app)

DB_HOST = "localhost"
DB_NAME = "testdatabase"
DB_PASSWORD = "password"
DB_PORT = 5432
DB_USER = "user"
DB_QUERIES = [
    "../scripts/clear_db.sql",
    "../scripts/create_database.sql",
    "../scripts/init_database.sql",
]


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_register_new_user(_):
    """
    Test registering a new user.
    """

    response = client.post(
        "/auth/register",
        json={
            "name": "Test",
            "surname": "User",
            "email": "test@user",
            "password": "user",
        },
    )

    assert response.status_code == 200
    assert response.json() == {"message": "User registered successfully"}


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_register_existing_user(_):
    """
    Test registering an existing user.
    """

    register_user("test@user", "user", client)

    response = client.post(
        "/auth/register",
        json={
            "name": "Test",
            "surname": "User",
            "email": "test@user",
            "password": "user",
        },
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "User already exists."}


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_login_success(_):
    """
    Test logging in a user.
    """

    register_user("test@user", "user", client)

    response = client.post(
        "/auth/token",
        data={"username": "test@user", "password": "user"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_login_success_invalid_password(_):
    """
    Test logging in a user with an invalid password.
    """

    register_user("test@user", "user", client)

    response = client.post(
        "/auth/token",
        data={"username": "test@user", "password": "wrong-password"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_login_non_existent_user(_):
    """
    Test logging in a non-existent user.
    """

    response = client.post(
        "/auth/token",
        data={"username": "nonexistent@user", "password": "user"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_login_currently_logged_in(_):
    """
    Test logging in a user that is already logged in.
    """

    register_user("test@user", "user", client)

    token = get_auth_token("test@user", "user", client)

    response = client.get(
        "auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": 3,
        "name": "Test",
        "surname": "User",
        "email": "test@user",
        "is_admin": False,
    }
