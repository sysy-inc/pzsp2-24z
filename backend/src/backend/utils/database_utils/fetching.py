from sqlalchemy import select, func
from src.backend.utils.database_utils.db_controller import async_session
from src.backend.utils.database_utils.models import (
    Sensor,
    Measurement,
    MeasurementType,
    UserPlatform,
)


async def fetch_test_data():
    async with async_session() as session:
        query = select(Measurement)
        result = await session.execute(query)
        measurements = result.scalars().all()
        return measurements

