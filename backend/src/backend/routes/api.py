from typing import Dict
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
)

from src.backend.utils.database_utils.fetching import (
    fetch_latest_measurements_for_platform,
    fetch_user_platform_access,
)
from src.backend.utils.auth_utils import get_current_user
from src.backend.utils.database_utils.data_models import MeasurementsResponse


api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@api_router.get(
    "/platforms/{platform_id}/latest-measurements", response_model=MeasurementsResponse
)
async def get_latest_measurements_from_platform_by_user(
    platform_id: int = Path(..., description="ID of the platform"),
    user_id: int = Depends(get_current_user),
):
    """
    Get the latest measurements from a platform that the user has access to.
    """
    user_has_platform_access = await fetch_user_platform_access(user_id, platform_id)

    if user_has_platform_access is False:
        raise HTTPException(
            status_code=403, detail="User has no access to this platform."
        )

    latest_measurements = await fetch_latest_measurements_for_platform(
        platform_id=platform_id
    )

    return latest_measurements
