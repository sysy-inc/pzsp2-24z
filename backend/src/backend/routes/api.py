import re
from fastapi import APIRouter
from src.backend.utils import fetch_example_data

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    return {"status": "ok"}


@api_router.get("/test_db")
async def test_db():
    query_result = await fetch_example_data()
    return {"data": query_result}
