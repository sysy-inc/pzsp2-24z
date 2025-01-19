from datetime import datetime
from typing import Annotated

import sqlalchemy
import sqlalchemy.exc
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import between, select
from sqlalchemy.orm import selectinload
from sqlalchemy.orm.session import Session

from src.backend.utils.database_utils.fetching import (
    fetch_latest_measurements_for_platform,
)
from src.backend.routes.auth import get_current_user
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

platforms = APIRouter()


class PlatformsResponseSingle(BaseModel):
    name: str = Field(..., title="Name of the platform")
    id: int = Field(..., title="ID of the platform")
    measurement_types: list[MeasurementTypeSchema] = Field(
        ..., title="List of sensors on the platform"
    )
    model_config = {
        "from_attributes": True,
    }


class PlatformsResponseSensor(BaseModel):
    id: int = Field(..., title="ID of the sensor")
    measurement_type: MeasurementTypeSchema = Field(
        ..., title="Measurement type of the sensor"
    )
    model_config = {
        "from_attributes": True,
    }


class PlatformsResponsePlatform(BaseModel):
    name: str = Field(..., title="Name of the platform")
    id: int = Field(..., title="ID of the platform")
    sensors: list[PlatformsResponseSensor] = Field(
        ..., title="List of sensors on the platform"
    )
    model_config = {
        "from_attributes": True,
    }


@platforms.get("/{platform_id}/latest_measurements")
def get_latest_measurements(
    platform_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session),
    measurement_type: str = Query(
        alias="measurementType", description="Measurement type"
    ),
):
    measurements = fetch_latest_measurements_for_platform(platform_id)

    latest_measurement = measurements.measurements[measurement_type][0]

    measurements_respone = MeasurementsResponseEntry(
        date=latest_measurement.date, value=latest_measurement.value
    )

    return measurements_respone


@platforms.get("/", response_model=list[PlatformsResponsePlatform])
def read_platforms(
    user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session),
):

    results: list[PlatformsResponsePlatform] = []

    query = session.execute(
        select(Platform)
        .join(UserPlatform, Platform.id == UserPlatform.platform_id)
        .join(User, User.id == UserPlatform.user_id)
        .join(Sensor, Sensor.platform_id == Platform.id)
        .join(MeasurementType, Sensor.measurement_type_id == MeasurementType.id)
        .options(selectinload(Platform.sensors).selectinload(Sensor.measurement_type))
        .where(User.id == user.id)
        .distinct()
    )
    user_platforms = query.scalars().unique().all()

    for platform in user_platforms:
        results.append(PlatformsResponsePlatform.model_validate(platform))

    return results


@platforms.get("/{platform_id}", response_model=PlatformsResponsePlatform)
def read_platform(
    platform_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session),
):

    res = session.execute(
        select(Platform)
        .join(UserPlatform, Platform.id == UserPlatform.platform_id)
        .join(User, User.id == UserPlatform.user_id)
        .join(Sensor, Sensor.platform_id == Platform.id)
        .join(MeasurementType, Sensor.measurement_type_id == MeasurementType.id)
        .options(selectinload(Platform.sensors).selectinload(Sensor.measurement_type))
        .where(User.id == user.id)
        .where(Platform.id == platform_id)
        .distinct()
    )

    platform = res.scalars().unique().first()

    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")

    return PlatformsResponsePlatform.model_validate(platform)


class MeasurementsResponseEntry(BaseModel):
    date: datetime = Field(..., title="Timestamp of the measurement")
    value: float = Field(..., title="Value of the measurement")
    model_config = {
        "from_attributes": True,
    }


@platforms.get(
    "/{platform_id}/measurements/",
    response_model=list[MeasurementsResponseEntry],
)
def read_measurements(
    platform_id: int,
    user: Annotated[User, Depends(get_current_user)],
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

    sensor_query = session.execute(
        select(Sensor)
        .join(Platform, Sensor.platform_id == Platform.id)
        .join(UserPlatform, Platform.id == UserPlatform.platform_id)
        .join(User, User.id == UserPlatform.user_id)
        .join(MeasurementType, Sensor.measurement_type_id == MeasurementType.id)
        .where(Sensor.platform_id == platform_id)
        .where(User.id == user.id)
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
        MeasurementsResponseEntry.model_validate(measurement)
        for measurement in measurements
    ]


class PlatformCreateRequest(BaseModel):
    name: str = Field(..., title="Name of the platform")


@platforms.post("/", response_model=PlatformSchema)
def create_platform(
    platform: PlatformCreateRequest,
    user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session),
):

    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    new_platform = Platform(name=platform.name)
    session.add(new_platform)
    session.commit()
    session.refresh(new_platform)

    return PlatformSchema.model_validate(new_platform)


class PlatformAddUserRequest(BaseModel):
    email: str = Field(..., title="Email of the user")


@platforms.post("/{platform_id}/users/")
def add_user_to_platform(
    platform_id: int,
    user_data: PlatformAddUserRequest,
    user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session),
):

    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    new_user = session.query(User).filter(User.email == user_data.email).first()

    if new_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    platform = session.query(Platform).filter(Platform.id == platform_id).first()
    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")

    user_platform = UserPlatform(user_id=new_user.id, platform_id=platform.id)
    try:
        session.add(user_platform)
        session.commit()
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(status_code=400, detail="User already added to platform")

    session.refresh(user_platform)
    return UserPlatformSchema.model_validate(user_platform)


@platforms.delete("/{platform_id}/users/{user_id}")
def delete_user_from_platform(
    platform_id: int,
    user_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session),
):

    if not user.is_admin:
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
