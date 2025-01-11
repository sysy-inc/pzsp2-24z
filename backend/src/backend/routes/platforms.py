from datetime import datetime
from os import name
from pprint import pp, pprint
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query
import psycopg2
from pydantic import BaseModel, Field
import sqlalchemy
import sqlalchemy.exc
from sqlalchemy.orm.session import Session
from sqlalchemy import between, select

from src.backend.utils.database_utils.db_controller import get_session
from src.backend.utils.database_utils.models import (
    Measurement,
    MeasurementType,
    MeasurementTypeSchema,
    Platform,
    PlatformSchema,
    Sensor,
    User,
    UserPlatform,
    UserPlatformSchema,
)
from sqlalchemy.orm import selectinload


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


class PlatformCreateRequest(BaseModel):
    name: str = Field(..., title="Name of the platform")


@platforms.post("/", response_model=PlatformSchema)
def create_platform(
    platform: PlatformCreateRequest, session: Session = Depends(get_session)
):
    is_user_admin = True

    if not is_user_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    new_platform = Platform(name=platform.name)
    session.add(new_platform)
    session.commit()
    session.refresh(new_platform)

    return PlatformSchema.model_validate(new_platform.__dict__)


class PlatformAddUserRequest(BaseModel):
    email: str = Field(..., title="Email of the user")


@platforms.post("/{platform_id}/users/")
def add_user_to_platform(
    platform_id: int,
    user_data: PlatformAddUserRequest,
    session: Session = Depends(get_session),
):
    is_user_admin = True

    if not is_user_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    user = session.query(User).filter(User.email == user_data.email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    platform = session.query(Platform).filter(Platform.id == platform_id).first()
    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")

    user_platform = UserPlatform(user_id=user.id, platform_id=platform.id)
    try:
        session.add(user_platform)
        session.commit()
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(status_code=400, detail="User already added to platform")

    session.refresh(user_platform)
    return UserPlatformSchema.model_validate(user_platform.__dict__)


@platforms.delete("/{platform_id}/users/{user_id}")
def delete_user_from_platform(
    platform_id: int,
    user_id: int,
    session: Session = Depends(get_session),
):
    is_user_admin = True

    if not is_user_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    user_platform = (
        session.query(UserPlatform)
        .filter(UserPlatform.user_id == user_id)
        .filter(UserPlatform.platform_id == platform_id)
        .first()
    )
    if user_platform is None:
        raise HTTPException(status_code=400, detail="User not found on platform")

    session.delete(user_platform)
    session.commit()
    return {"message": "User deleted from platform"}
