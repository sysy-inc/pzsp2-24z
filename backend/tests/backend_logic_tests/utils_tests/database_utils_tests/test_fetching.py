import pytest
from src.backend.utils.database_utils.data_models import (
    MeasurementsResponse,
    MeasurementData,
)
from src.backend.utils.database_utils.fetching import (
    fetch_latest_measurements_for_platform,
    fetch_user_platform_access,
)


@pytest.mark.asyncio
async def test_fetch_latest_measurements_for_platform(monkeypatch):
    # Mocked response data
    mocked_rows = [
        {
            "sensor_id": 1,
            "value": 42.5,
            "date": "2024-12-14",
            "physical_parameter": "Temperature",
            "unit": "Celsius",
        },
        {
            "sensor_id": 2,
            "value": 78.9,
            "date": "2024-12-14",
            "physical_parameter": "Humidity",
            "unit": "%",
        },
    ]

    async def mock_execute(_):
        class MockResult:
            def mappings(self):
                return MockResult()

            def all(self):
                return mocked_rows

        return MockResult()

    class MockSession:
        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

        async def execute(self, query):
            return await mock_execute(query)

    # Return a callable that creates MockSession instances
    monkeypatch.setattr(
        "src.backend.utils.database_utils.fetching.async_session",
        lambda: MockSession(),
    )

    platform_id = 123

    result = await fetch_latest_measurements_for_platform(platform_id)

    expected = MeasurementsResponse(
        measurements={
            "Temperature": MeasurementData(
                sensor_id=1, value=42.5, date="2024-12-14", unit="Celsius"
            ),
            "Humidity": MeasurementData(
                sensor_id=2,
                value=78.9,
                date="2024-12-14",
                unit="%",
            ),
        }
    )

    assert result == expected


@pytest.mark.asyncio
async def test_fetch_user_platform_access(monkeypatch):
    # Mocked scalar result
    mocked_result = True

    async def mock_execute(_):
        class MockResult:
            def scalars(self):
                class MockScalars:
                    def first(self):
                        return mocked_result

                return MockScalars()

        return MockResult()

    class MockSession:
        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

        async def execute(self, query):
            return await mock_execute(query)

    # Return a callable that creates MockSession instances
    monkeypatch.setattr(
        "src.backend.utils.database_utils.fetching.async_session",
        lambda: MockSession(),
    )

    user_id = 456
    platform_id = 123

    result = await fetch_user_platform_access(user_id, platform_id)

    assert result is True
