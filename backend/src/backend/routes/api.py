from fastapi import APIRouter
from src.backend.utils import (
    fetch_test_data,
    fetch_latest_measurement,
)

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    return {"status": "ok"}


@api_router.get("/test_db")
async def test_db():
    query_result = await fetch_test_data()
    return {"data": query_result}


@api_router.get("/get_latest_measurement")
async def get_latest_measurement():
    # Return the latest measurement from sensor 1 and 2
    query_result = await fetch_latest_measurement()
    return {"data": query_result}
