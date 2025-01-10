from typing import Any
from fastapi.testclient import TestClient
import pytest

from tests.api_tests.conftest import postgres_db_fixture
from src.backend.app import app

client = TestClient(app)


@postgres_db_fixture(
    db_host="localhost",
    db_name="postgres",
    db_password="postgres",
    db_port=5432,
    db_user="postgres",
    queries=[
        "../scripts/clear_db.sql",
        "../scripts/create_database.sql",
        "../scripts/init_database.sql",
    ],
)
def test_get_all_platforms():
    response = client.get("/api/platforms/")

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


@postgres_db_fixture(
    db_host="localhost",
    db_name="postgres",
    db_password="postgres",
    db_port=5432,
    db_user="postgres",
    queries=[
        "../scripts/clear_db.sql",
        "../scripts/create_database.sql",
        "../scripts/init_database.sql",
    ],
)
def test_get_single_platform():
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
        db_host="localhost",
        db_name="postgres",
        db_password="postgres",
        db_port=5432,
        db_user="postgres",
        queries=[
            "../scripts/clear_db.sql",
            "../scripts/create_database.sql",
            "../scripts/init_database.sql",
        ],
    )
    def test_wrapper():
        response = client.get(
            f"/api/platforms/{platform_id}/measurements/?measurementType={measurement_type}&dateFrom={date_from}&dateTo={date_to}"
        )

        assert response.status_code == expected_status_code
        assert response.json() == expected_response

    test_wrapper()
