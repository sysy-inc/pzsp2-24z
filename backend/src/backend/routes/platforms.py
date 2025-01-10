from datetime import datetime
from pprint import pprint
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm.session import Session
from sqlalchemy import between, select

from src.backend.utils.database_utils.db_controller import get_session
from src.backend.utils.database_utils.models import (
    Measurement,
    MeasurementType,
    MeasurementTypeSchema,
    Platform,
    Sensor,
    SensorSchema,
    User,
    UserPlatform,
)
from sqlalchemy.orm import joinedload, selectinload


platforms = APIRouter()


class PlatformsResponseSingle(BaseModel):
    name: str = Field(..., title="Name of the platform")
    id: int = Field(..., title="ID of the platform")
    measurement_types: list[MeasurementTypeSchema] = Field(
        ..., title="List of sensors on the platform"
    )


class PlatformsResponseSensor(BaseModel):
    id: int = Field(..., title="ID of the sensor")
    measurement_type: MeasurementTypeSchema = Field(
        ..., title="Measurement type of the sensor"
    )


class PlatformsResponsePlatform(BaseModel):
    name: str = Field(..., title="Name of the platform")
    id: int = Field(..., title="ID of the platform")
    sensors: list[PlatformsResponseSensor] = Field(
        ..., title="List of sensors on the platform"
    )


@platforms.get("/", response_model=list[PlatformsResponsePlatform])
def read_platforms(session: Session = Depends(get_session)):
    _user_id = 1

    results: list[PlatformsResponsePlatform] = []

    query = session.execute(
        select(Platform)
        .join(UserPlatform, Platform.id == UserPlatform.platform_id)
        .join(User, User.id == UserPlatform.user_id)
        .join(Sensor, Sensor.platform_id == Platform.id)
        .join(MeasurementType, Sensor.measurement_type_id == MeasurementType.id)
        .options(selectinload(Platform.sensors).selectinload(Sensor.measurement_type))
        .where(User.id == _user_id)
        .distinct()
    )
    user_platforms = query.scalars().unique().all()

    for platform in user_platforms:
        plat_sensors: list[dict[str, Any]] = []
        for sensor in platform.sensors:
            plat_sensors.append(
                {
                    **sensor.__dict__,
                    "measurement_type": sensor.measurement_type.__dict__,
                }
            )
        results.append(
            PlatformsResponsePlatform.model_validate(
                {**platform.__dict__, "sensors": plat_sensors}
            )
        )

    return results


@platforms.get("/{platform_id}", response_model=PlatformsResponsePlatform)
def read_platform(platform_id: int, session: Session = Depends(get_session)):
    _user_id = 1

    res = session.execute(
        select(Platform)
        .join(UserPlatform, Platform.id == UserPlatform.platform_id)
        .join(User, User.id == UserPlatform.user_id)
        .join(Sensor, Sensor.platform_id == Platform.id)
        .join(MeasurementType, Sensor.measurement_type_id == MeasurementType.id)
        .options(selectinload(Platform.sensors).selectinload(Sensor.measurement_type))
        .where(User.id == _user_id)
        .where(Platform.id == platform_id)
        .distinct()
    )

    platform = res.scalars().unique().first()

    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")

    platform_sensors: list[dict[str, Any]] = [
        {**sensor.__dict__, "measurement_type": sensor.measurement_type.__dict__}
        for sensor in platform.sensors
    ]

    return PlatformsResponsePlatform.model_validate(
        {
            **platform.__dict__,
            "sensors": platform_sensors,
        }
    )


class MeasurementsResponseEntry(BaseModel):
    date: datetime = Field(..., title="Timestamp of the measurement")
    value: float = Field(..., title="Value of the measurement")


@platforms.get(
    "/{platform_id}/measurements/",
    response_model=list[MeasurementsResponseEntry],
)
def read_measurements(
    platform_id: int,
    session: Session = Depends(get_session),
    measurement_type: str = Query(
        alias="measurementType", description="Measurement type"
    ),
    date_from: datetime = Query(
        datetime.now().replace(hour=0, minute=0, second=0, microsecond=0),
        alias="dateFrom",
        description="Start date for the range",
    ),
    date_to: datetime = Query(
        datetime.now(), alias="dateTo", description="End date for the range"
    ),
):
    _user_id = 1

    sensor_query = session.execute(
        select(Sensor)
        .join(Platform, Sensor.platform_id == Platform.id)
        .join(UserPlatform, Platform.id == UserPlatform.platform_id)
        .join(User, User.id == UserPlatform.user_id)
        .join(MeasurementType, Sensor.measurement_type_id == MeasurementType.id)
        .where(Sensor.platform_id == platform_id)
        .where(User.id == _user_id)
        .where(Sensor.measurement_type.has(physical_parameter=measurement_type))
    )
    sensor = sensor_query.scalars().unique().first()
    if sensor is None:
        raise HTTPException(status_code=404, detail="Sensor not found")

    measurements_query = session.execute(
        select(Measurement)
        .where(Measurement.sensor_id == sensor.id)
        .where(between(Measurement.date, date_from, date_to))
        .order_by(Measurement.date.desc())
    )

    measurements = measurements_query.scalars().unique().all()
    return [
        MeasurementsResponseEntry.model_validate(measurement.__dict__)
        for measurement in measurements
    ]
