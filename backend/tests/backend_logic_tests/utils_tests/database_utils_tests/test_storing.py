import pytest
from src.backend.utils.database_utils.storing import save_sample_to_db
from src.backend.utils.database_utils.data_models import MeasurementFromPlatform


import pytest
from src.backend.utils.database_utils.storing import save_sample_to_db
from src.backend.utils.database_utils.data_models import MeasurementFromPlatform


@pytest.mark.asyncio
async def test_save_sample_to_db_valid(monkeypatch):
    # Valid JSON input for the function
    valid_json = '{"sensor_id": 1, "value": 42.5}'

    # Shared state to persist added_instance
    shared_state = {"added_instance": None}

    # Mock the database session and session.begin
    class MockSession:
        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

        def add(self, instance):
            shared_state["added_instance"] = instance

        # Mock `session.begin` for nested context management
        class BeginContext:
            async def __aenter__(self):
                return self

            async def __aexit__(self, exc_type, exc_val, exc_tb):
                pass

        def begin(self):
            return self.BeginContext()

    # Use lambda for factory to ensure mock is callable like the real async_session
    monkeypatch.setattr(
        "src.backend.utils.database_utils.storing.async_session",
        lambda: MockSession(),
    )

    # Run the function with valid input
    await save_sample_to_db(valid_json)

    # Verify the `Measurement` object is created correctly and added to the session
    assert shared_state["added_instance"] is not None
    assert shared_state["added_instance"].sensor_id == 1
    assert shared_state["added_instance"].value == 42.5


@pytest.mark.asyncio
async def test_save_sample_to_db_invalid_json():
    # Invalid JSON input
    invalid_json = '{"sensor_id": 1, "value": "invalid"}'  # Invalid value for a float

    with pytest.raises(
        ValueError, match="Validation error"
    ):  # Expect a validation error
        await save_sample_to_db(invalid_json)


@pytest.mark.asyncio
async def test_save_sample_to_db_database_error(monkeypatch):
    # Valid JSON input for the function
    valid_json = '{"sensor_id": 1, "value": 42.5}'

    # Mock the database session to raise an error
    class MockSession:
        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

        def add(self, instance):
            raise Exception("Database error")

        # Mock `session.begin` for nested context management
        class BeginContext:
            async def __aenter__(self):
                return self

            async def __aexit__(self, exc_type, exc_val, exc_tb):
                pass

        def begin(self):
            return self.BeginContext()

    mock_session_instance = MockSession()

    async def mock_async_session():
        return mock_session_instance

    # Use lambda for factory to ensure mock is callable like the real async_session
    monkeypatch.setattr(
        "src.backend.utils.database_utils.storing.async_session",
        lambda: mock_async_session(),
    )

    # Run the function and expect an exception to be caught
    await save_sample_to_db(
        valid_json
    )  # Should not raise but log the error #TODO How to test that?
