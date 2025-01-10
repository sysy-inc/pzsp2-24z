from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import String, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship, mapped_column, Mapped
from src.backend.utils.database_utils.db_controller import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20))
    surname: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(40), unique=True)
    passwd: Mapped[str] = mapped_column(String(30))

    users_platforms: Mapped[List["UserPlatform"]] = relationship(back_populates="user")


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

    model_config = ConfigDict(from_attributes=True)


class UserPlatform(Base):
    __tablename__ = "users_platforms"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    platform_id: Mapped[int] = mapped_column(ForeignKey("platforms.id"))

    user: Mapped["User"] = relationship(back_populates="users_platforms")
    platform: Mapped["Platform"] = relationship(back_populates="users_platforms")


class Sensor(Base):
    __tablename__ = "sensors"

    id: Mapped[int] = mapped_column(primary_key=True)
    measurement_type_id: Mapped[int] = mapped_column(ForeignKey("measurement_types.id"))
    platform_id: Mapped[int] = mapped_column(ForeignKey("platforms.id"))

    platform: Mapped["Platform"] = relationship(back_populates="sensors")
    measurement_type: Mapped["MeasurementType"] = relationship(back_populates="sensors")
    measurements: Mapped[List["Measurement"]] = relationship(back_populates="sensor")


class MeasurementType(Base):
    __tablename__ = "measurement_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    physical_parameter: Mapped[str] = mapped_column(String(30))
    unit: Mapped[str] = mapped_column(String(15))

    sensors: Mapped[List["Sensor"]] = relationship(back_populates="measurement_type")


class Measurement(Base):
    __tablename__ = "measurements"

    id: Mapped[int] = mapped_column(primary_key=True)
    sensor_id: Mapped[int] = mapped_column(ForeignKey("sensors.id"))
    value: Mapped[float] = mapped_column(DECIMAL(8, 4))
    date: Mapped[datetime] = mapped_column(TIMESTAMP)

    sensor: Mapped["Sensor"] = relationship(back_populates="measurements")
