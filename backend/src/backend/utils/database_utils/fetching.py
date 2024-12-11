from sqlalchemy import select, func
from src.backend.utils.database_utils.db_controller import async_session
from src.backend.utils.database_utils.models import (
    Sensor,
    Measurement,
    MeasurementType,
    UserPlatform,
)


async def fetch_test_data():
    """
    Fetch all measurements from the database.
    """
    async with async_session() as session:
        query = select(Measurement)
        result = await session.execute(query)
        measurements = result.scalars().all()
        return measurements


async def fetch_latest_measurements_for_platform(platform_id: int) -> dict:
    """
    Fetch the latest measurements for each sensor on a platform.
    """
    async with async_session() as session:
        # Subquery: Get the latest measurement date for each sensor on the platform
        latest_measurements_dates_subquery = (
            select(
                Measurement.sensor_id,
                func.max(Measurement.date).label("latest_date"),
            )
            .join(Sensor, Sensor.id == Measurement.sensor_id)
            .filter(Sensor.platform_id == platform_id)
            .group_by(Measurement.sensor_id)
            .subquery()
        )

        # Main Query: Join with Measurement Type, and get latest measurements

        query = (
            select(
                Measurement.sensor_id,
                Measurement.value,
                Measurement.date,
                MeasurementType.physical_parameter,
                MeasurementType.unit,
            )
            .join(
                latest_measurements_dates_subquery,
                (
                    Measurement.sensor_id
                    == latest_measurements_dates_subquery.c.sensor_id
                )
                & (
                    Measurement.date == latest_measurements_dates_subquery.c.latest_date
                ),
            )
            .join(Sensor, Sensor.id == Measurement.sensor_id)
            .join(MeasurementType, MeasurementType.id == Sensor.measurement_type_id)
        )

        result = await session.execute(query)

        rows = result.mappings().all()

        return {
            row["physical_parameter"]: {
                "sensor_id": row["sensor_id"],
                "value": row["value"],
                "date": row["date"],
                "unit": row["unit"],
            }
            for row in rows
        }


async def fetch_user_platform_access(user_id: int, platform_id: int) -> bool:
    """
    Check if a user has access to a specific platform.
    """
    async with async_session() as session:
        query = (
            select(UserPlatform)
            .filter(
                UserPlatform.user_id == user_id, UserPlatform.platform_id == platform_id
            )
            .limit(1)
        )
        result = await session.execute(query)
        return result.scalars().first() is not None
