from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field
from sqlalchemy import DECIMAL, TIMESTAMP, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.backend.utils.database_utils.db_controller import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20))
    surname: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(40), unique=True)
    hashed_pwd: Mapped[str] = mapped_column(String(60))
    is_admin: Mapped[bool] = mapped_column()

    users_platforms: Mapped[List["UserPlatform"]] = relationship(back_populates="user")


class UserSchema(BaseModel):
    name: str = Field(..., title="Name of the user")
    surname: str = Field(..., title="Surname of the user")
    email: str = Field(..., title="Email of the user")
    hashed_pwd: str = Field(..., title="Password of the user")
    is_admin: bool = Field(False, title="Admin status of the user")
    id: int = Field(..., title="ID of the user")
    model_config = {
        "from_attributes": True,
    }


class Platform(Base):
    __tablename__ = "platforms"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String(100))

    users_platforms: Mapped[List["UserPlatform"]] = relationship(
        back_populates="platform"
    )
    sensors: Mapped[List["Sensor"]] = relationship(back_populates="platform")


class PlatformSchema(BaseModel):
    name: str = Field(..., title="Name of the platform")
    id: int = Field(..., title="ID of the platform")
    model_config = {
        "from_attributes": True,
    }


class UserPlatform(Base):
    __tablename__ = "users_platforms"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    platform_id: Mapped[int] = mapped_column(
        ForeignKey("platforms.id"), primary_key=True
    )

    user: Mapped["User"] = relationship(back_populates="users_platforms")
    platform: Mapped["Platform"] = relationship(back_populates="users_platforms")


class UserPlatformSchema(BaseModel):
    user_id: int = Field(..., title="ID of the user")
    platform_id: int = Field(..., title="ID of the platform")
    model_config = {
        "from_attributes": True,
    }


class Sensor(Base):
    __tablename__ = "sensors"

    id: Mapped[int] = mapped_column(primary_key=True)
    measurement_type_id: Mapped[int] = mapped_column(ForeignKey("measurement_types.id"))
    platform_id: Mapped[int] = mapped_column(ForeignKey("platforms.id"))

    platform: Mapped["Platform"] = relationship(back_populates="sensors")
    measurement_type: Mapped["MeasurementType"] = relationship(back_populates="sensors")
    measurements: Mapped[List["Measurement"]] = relationship(back_populates="sensor")


class SensorSchema(BaseModel):
    id: int = Field(..., title="ID of the sensor")
    measurement_type_id: int = Field(..., title="ID of the measurement type")
    platform_id: int = Field(..., title="ID of the platform")
    model_config = {
        "from_attributes": True,
    }


class MeasurementType(Base):
    __tablename__ = "measurement_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    physical_parameter: Mapped[str] = mapped_column(String(30))
    unit: Mapped[str] = mapped_column(String(15))

    sensors: Mapped[List["Sensor"]] = relationship(back_populates="measurement_type")


class MeasurementTypeSchema(BaseModel):
    id: int = Field(..., title="ID of the measurement type")
    physical_parameter: str = Field(..., title="Physical parameter")
    unit: str = Field(..., title="Unit")
    model_config = {
        "from_attributes": True,
    }


class Measurement(Base):
    __tablename__ = "measurements"

    id: Mapped[int] = mapped_column(primary_key=True)
    sensor_id: Mapped[int] = mapped_column(ForeignKey("sensors.id"))
    value: Mapped[float] = mapped_column(DECIMAL(8, 4))
    date: Mapped[datetime] = mapped_column(TIMESTAMP)

    sensor: Mapped["Sensor"] = relationship(back_populates="measurements")


class MeasurementSchema(BaseModel):
    sensor_id: int = Field(..., title="ID of the sensor")
    value: float = Field(..., title="Value of the measurement")
    date: datetime = Field(..., title="Date of the measurement")
    id: int = Field(..., title="ID of the measurement")
    model_config = {
        "from_attributes": True,
    }
