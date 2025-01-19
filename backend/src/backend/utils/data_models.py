from datetime import datetime

from pydantic import BaseModel


class MeasurementData(BaseModel):
    sensor_id: int
    value: float
    date: datetime
    unit: str


class MeasurementsResponse(BaseModel):
    measurements: dict[str, list[MeasurementData]]


class MeasurementFromPlatform(BaseModel):
    sensor_id: int
    value: float
