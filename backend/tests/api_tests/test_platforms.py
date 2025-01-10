from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
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
@pytest.mark.anyio
async def test_get_all_platforms():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://localhost"
    ) as ac:
        response = await ac.get("/api/platforms/")

    assert response.status_code == 200
    assert response.json() == [
        {
            "name": "Example Platform",
            "id": 1,
            "measurement_types": [
                {"physical_parameter": "Temperature", "unit": "°C"},
                {"physical_parameter": "Humidity", "unit": "%"},
            ],
        },
        {
            "name": "Second Platform",
            "id": 2,
            "measurement_types": [
                {"physical_parameter": "Temperature", "unit": "°C"},
                {"physical_parameter": "Humidity", "unit": "%"},
            ],
        },
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
@pytest.mark.anyio
async def test_get_single_platform():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://localhost"
    ) as ac:
        response = await ac.get("/api/platforms/1")

    assert response.status_code == 200
    assert response.json() == {
        "name": "Example Platform",
        "id": 1,
        "measurement_types": [
            {"physical_parameter": "Temperature", "unit": "°C"},
            {"physical_parameter": "Humidity", "unit": "%"},
        ],
    }

    response2 = client.get("/api/platforms/2")
    assert response2.status_code == 200
    assert response2.json() == {
        "name": "Second Platform",
        "id": 2,
        "measurement_types": [
            {"physical_parameter": "Temperature", "unit": "°C"},
            {"physical_parameter": "Humidity", "unit": "%"},
        ],
    }
