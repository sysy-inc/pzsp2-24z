from pprint import pprint
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.backend.utils.database_utils.db_controller import get_session
from src.backend.utils.database_utils.models import (
    MeasurementTypeSchema,
    Platform,
    Sensor,
)
from sqlalchemy.orm import joinedload


platforms = APIRouter()


class PlatformsResponseSingle(BaseModel):
    name: str = Field(..., title="Name of the platform")
    id: int = Field(..., title="ID of the platform")
    measurement_types: list[MeasurementTypeSchema] = Field(
        ..., title="List of sensors on the platform"
    )


@platforms.get("/", response_model=list[PlatformsResponseSingle])
async def read_platforms(session: AsyncSession = Depends(get_session)):
    results: list[PlatformsResponseSingle] = []

    res = await session.execute(
        select(Platform).options(
            joinedload(Platform.sensors).joinedload(Sensor.measurement_type)
        )
    )

    for platform in res.scalars().unique().all():
        platform_sensors_types = [
            sensor.__dict__["measurement_type"].__dict__ for sensor in platform.sensors
        ]
        results.append(
            PlatformsResponseSingle.model_validate(
                {
                    **platform.__dict__,
                    "measurement_types": platform_sensors_types,
                }
            )
        )

    return results


@platforms.get("/{platform_id}", response_model=PlatformsResponseSingle)
async def read_platform(platform_id: int, session: AsyncSession = Depends(get_session)):
    res = await session.execute(
        select(Platform)
        .options(joinedload(Platform.sensors).joinedload(Sensor.measurement_type))
        .where(Platform.id == platform_id)
    )

    platform = res.scalars().unique().first()

    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")

    platform_sensors_types = [
        sensor.__dict__["measurement_type"].__dict__ for sensor in platform.sensors
    ]

    return PlatformsResponseSingle.model_validate(
        {
            **platform.__dict__,
            "measurement_types": platform_sensors_types,
        }
    )
