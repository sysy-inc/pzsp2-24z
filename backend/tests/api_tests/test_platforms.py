from atexit import register
from typing import Any
from fastapi.testclient import TestClient
import pytest

from tests.api_tests.conftest import (
    call_no_params,
    postgres_db_fixture,
    make_user_admin,
)
from src.backend.app import app
from src.backend.routes.auth import RegisterRequest
from psycopg2.extensions import connection

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


def register_user(email: str, password: str) -> None:
    response = client.post(
        "/auth/register",
        json={"name": "Test", "surname": "User", "email": email, "password": password},
    )
    assert response.status_code == 200


def get_auth_token(username: str, password: str) -> str:
    """Get an authentication token by simulating a login request."""
    response = client.post(
        "/auth/token",
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_get_all_platforms(_):

    register_user("test@admin", "admin")

    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)

    token = get_auth_token("admin@admin", "admin")

    response = client.get(
        "/api/platforms/",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json() == [
        {
            "name": "Example Platform",
            "id": 1,
            "sensors": [
                {
                    "id": 1,
                    "measurement_type": {
                        "id": 1,
                        "physical_parameter": "Temperature",
                        "unit": "°C",
                    },
                },
                {
                    "id": 2,
                    "measurement_type": {
                        "id": 2,
                        "physical_parameter": "Humidity",
                        "unit": "%",
                    },
                },
            ],
        }
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
def test_get_single_platform(_):
    response = client.get("/api/platforms/1")

    assert response.status_code == 200
    assert response.json() == {
        "name": "Example Platform",
        "id": 1,
        "sensors": [
            {
                "id": 1,
                "measurement_type": {
                    "id": 1,
                    "physical_parameter": "Temperature",
                    "unit": "°C",
                },
            },
            {
                "id": 2,
                "measurement_type": {
                    "id": 2,
                    "physical_parameter": "Humidity",
                    "unit": "%",
                },
            },
        ],
    }

    response2 = client.get("/api/platforms/2")
    assert response2.status_code == 404
    assert response2.json() == {"detail": "Platform not found"}


@pytest.mark.parametrize(
    "platform_id, measurement_type, date_from, date_to, expected_status_code, expected_response",
    [
        (1, "Temperature", "2021-01-01T00:00:00", "2021-01-01T23:59:59", 200, []),
        (  # type: ignore
            1,
            "Temperature",
            "2021-01-01T00:00:00",
            "2025-01-01T00:00:00",
            200,
            [
                {"date": "2024-12-11T13:00:00", "value": 23.7},
                {"date": "2024-12-11T12:00:00", "value": 22.5},
            ],
        ),
        (
            2,
            "Temperature",
            "2021-01-01T00:00:00",
            "2025-01-01T23:59:59",
            404,
            {"detail": "Sensor not found"},
        ),
    ],
)
def test_get_platform_measurements(
    platform_id: int,
    measurement_type: str,
    date_from: str,
    date_to: str,
    expected_status_code: int,
    expected_response: list[dict[str, Any]],
):
    @postgres_db_fixture(
        db_host=DB_HOST,
        db_name=DB_NAME,
        db_password=DB_PASSWORD,
        db_port=DB_PORT,
        db_user=DB_USER,
        queries=DB_QUERIES,
    )
    def test_wrapper(_):
        response = client.get(
            f"/api/platforms/{platform_id}/measurements/?measurementType={measurement_type}&dateFrom={date_from}&dateTo={date_to}"
        )

        assert response.status_code == expected_status_code
        assert response.json() == expected_response

    test_wrapper()


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_create_platform_ok(connection: connection):
    response = client.post(
        "/api/platforms/",
        json={"name": "New Platform"},
    )

    assert response.status_code == 200
    assert response.json() == {"id": 3, "name": "New Platform"}

    cursor = connection.cursor()
    cursor.execute("SELECT * FROM platforms WHERE name = 'New Platform'")
    result = cursor.fetchone()
    assert result is not None
    assert result[0] == 3
    assert result[1] == "New Platform"


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_create_platform_bad_request(connection: connection):
    response = client.post(
        "/api/platforms/",
        json={"not-name": "test"},
    )

    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "type": "missing",
                "loc": ["body", "name"],
                "msg": "Field required",
                "input": {"not-name": "test"},
            }
        ]
    }

    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM platforms")
    result = cursor.fetchone()
    assert result is not None
    assert result[0] == 2


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_add_user_to_platform_ok(connection: connection):
    response = client.post(
        "/api/platforms/2/users/",
        json={"email": "admin@admin"},
    )

    assert response.status_code == 200
    assert response.json() == {"user_id": 1, "platform_id": 2}

    cursor = connection.cursor()
    cursor.execute(
        "SELECT * FROM users_platforms WHERE user_id = 1 AND platform_id = 2"
    )
    result = cursor.fetchone()
    assert result is not None
    assert result[0] == 1
    assert result[1] == 2


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_add_user_to_platform_bad_request(connection: connection):
    response = client.post(
        "/api/platforms/2/users/",
        json={"email": "john.doe@example.com"},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "User already added to platform"}

    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM users_platforms")
    result = cursor.fetchone()
    assert result is not None
    assert result[0] == 2


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_delete_user_from_platform_ok(connection: connection):
    response = client.delete("/api/platforms/2/users/2")

    assert response.status_code == 200
    assert response.json() == {"message": "User deleted from platform"}

    cursor = connection.cursor()
    cursor.execute(
        "SELECT * FROM users_platforms WHERE user_id = 2 AND platform_id = 2"
    )
    result = cursor.fetchone()
    assert result is None


@call_no_params
@postgres_db_fixture(
    db_host=DB_HOST,
    db_name="postgres",
    db_password="postgres",
    db_port=DB_PORT,
    db_user="postgres",
    queries=DB_QUERIES,
)
def test_delete_user_from_platform_user_not_on_platform(connection: connection):
    response = client.delete("/api/platforms/2/users/1")

    assert response.status_code == 400
    assert response.json() == {"detail": "User not found on platform"}

    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM users_platforms")
    result = cursor.fetchone()
    assert result is not None
    assert result[0] == 2
