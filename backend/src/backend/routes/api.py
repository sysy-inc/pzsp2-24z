import re
from fastapi import APIRouter
from src.backend.utils import fetch_user_data, initialize_test_user_data

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    return {"status": "ok"}


@api_router.get("/test_db")
async def test_db():
    query_result = await fetch_user_data()
    return {"data": query_result}


# Test endpoint
@api_router.get("/initialize_users")
async def initialize_users():
    # Check if the users table is empty
    users = await fetch_user_data()

    if not users:  # If the table is empty
        # Insert two example rows
        return await initialize_test_user_data()

    return {"message": "Users table is not empty."}
