from typing import Any

import pytest
from fastapi.testclient import TestClient
from psycopg2.extensions import connection

from src.backend.app import app
from tests.api_tests.conftest import (add_user_to_platform, call_no_params,
                                      get_auth_token, make_user_admin,
                                      postgres_db_fixture, register_user)

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
def test_get_all_platforms(_):

    register_user("test@admin", "admin", client)

    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)

    token = get_auth_token("test@admin", "admin", client)

    register_user("test@user", "user", client)

    token_user = get_auth_token("test@user", "user", client)

    add_user_to_platform(
        email="test@user", platform_id=1, admin_token=token, client=client
    )

    response = client.get(
        "/api/platforms/",
        headers={"Authorization": f"Bearer {token_user}"},
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

    register_user("test@admin", "admin", client)

    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)

    token = get_auth_token("test@admin", "admin", client)

    register_user("test@user", "user", client)

    token_user = get_auth_token("test@user", "user", client)

    add_user_to_platform(
        email="test@user", platform_id=1, admin_token=token, client=client
    )

    response = client.get(
        "/api/platforms/1",
        headers={"Authorization": f"Bearer {token_user}"},
    )

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

    response2 = client.get(
        "/api/platforms/2",
        headers={"Authorization": f"Bearer {token_user}"},
    )
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
            "Pressure",
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

        register_user("test@admin", "admin", client)
        make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
        token = get_auth_token("test@admin", "admin", client)

        register_user("test@user", "user", client)
        token_user = get_auth_token("test@user", "user", client)

        add_user_to_platform(
            email="test@user", platform_id=platform_id, admin_token=token, client=client
        )

        response = client.get(
            f"/api/platforms/{platform_id}/measurements/?measurementType={measurement_type}&dateFrom={date_from}&dateTo={date_to}",
            headers={"Authorization": f"Bearer {token_user}"},
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

    register_user("test@admin", "admin", client)

    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)

    token = get_auth_token("test@admin", "admin", client)

    response = client.post(
        "/api/platforms/",
        json={"name": "New Platform"},
        headers={"Authorization": f"Bearer {token}"},
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

    register_user("test@admin", "admin", client)
    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
    token = get_auth_token("test@admin", "admin", client)

    response = client.post(
        "/api/platforms/",
        json={"not-name": "test"},
        headers={"Authorization": f"Bearer {token}"},
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
def test_create_platform_unauthorized(connection: connection):

    register_user("test@user", "user", client)

    token = get_auth_token("test@user", "user", client)

    response = client.post(
        "/api/platforms/",
        json={"name": "test"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403
    assert response.json() == {"detail": "Forbidden"}

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

    register_user("test@admin", "admin", client)
    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
    token = get_auth_token("test@admin", "admin", client)

    register_user("test@user", "user", client)

    response = client.post(
        "/api/platforms/2/users/",
        json={"email": "test@user"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json() == {"user_id": 4, "platform_id": 2}

    cursor = connection.cursor()
    cursor.execute(
        "SELECT * FROM users_platforms WHERE user_id = 4 AND platform_id = 2"
    )
    result = cursor.fetchone()
    assert result is not None
    assert result[0] == 4
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

    register_user("test@admin", "admin", client)
    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
    token = get_auth_token("test@admin", "admin", client)

    response = client.post(
        "/api/platforms/2/users/",
        json={"email": "john.doe@example.com"},
        headers={"Authorization": f"Bearer {token}"},
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

    register_user("test@admin", "admin", client)
    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
    token = get_auth_token("test@admin", "admin", client)

    response = client.delete(
        "/api/platforms/2/users/2",
        headers={"Authorization": f"Bearer {token}"},
    )

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
    db_name=DB_NAME,
    db_password=DB_PASSWORD,
    db_port=DB_PORT,
    db_user=DB_USER,
    queries=DB_QUERIES,
)
def test_delete_user_from_platform_user_not_on_platform(connection: connection):

    register_user("test@admin", "admin", client)
    make_user_admin("test@admin", DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
    token = get_auth_token("test@admin", "admin", client)

    response = client.delete(
        "/api/platforms/2/users/99",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "User not found on platform"}

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
def test_delete_user_from_platform_unauthorized(connection: connection):

    register_user("test@user", "user", client)
    token = get_auth_token("test@user", "user", client)

    response = client.delete(
        "/api/platforms/2/users/2",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403
    assert response.json() == {"detail": "Forbidden"}

    cursor = connection.cursor()
    cursor.execute(
        "SELECT * FROM users_platforms WHERE user_id = 2 AND platform_id = 2"
    )
    result = cursor.fetchone()
    assert result is not None
