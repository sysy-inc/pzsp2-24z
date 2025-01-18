from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
)
from datetime import datetime

from src.backend.utils.database_utils.fetching import (
    fetch_latest_measurements_for_platform,
    fetch_latest_measurements_for_platform_within_range,
    fetch_user_platform_access,
)
from src.backend.routes.auth import get_current_user
from src.backend.utils.data_models import MeasurementsResponse


api_router = APIRouter()


@api_router.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@api_router.get(
    "/platforms/{platform_id}/latest-measurements", response_model=MeasurementsResponse
)
def get_latest_measurements_from_platform_by_user(
    platform_id: int = Path(..., description="ID of the platform"),
    user_id: int = Depends(get_current_user),
):
    """
    Get the latest measurements from a platform that the user has access to.
    """
    user_has_platform_access = fetch_user_platform_access(user_id, platform_id)

    if user_has_platform_access is False:
        raise HTTPException(
            status_code=403, detail="User has no access to this platform."
        )

    latest_measurements = fetch_latest_measurements_for_platform(
        platform_id=platform_id
    )

    return latest_measurements


@api_router.get("/platforms/{platform_id}/", response_model=MeasurementsResponse)
def get_measurements_from_platform_between_dates(
    date_from: datetime,
    date_to: datetime,
    platform_id: int = Path(..., description="ID of the platform"),
    user_id: int = Depends(get_current_user),
):
    user_has_platform_access = fetch_user_platform_access(user_id, platform_id)

    if user_has_platform_access is False:
        raise HTTPException(
            status_code=403, detail="User has no access to this platform."
        )

    range_measurements = fetch_latest_measurements_for_platform_within_range(
        platform_id, date_from, date_to
    )

    return range_measurements
