import json

from src.backend.models import User
from sqlalchemy import select
from src.backend.db_controller import async_session


async def fetch_user_data():
    async with async_session() as session:
        query = select(User)
        result = await session.execute(query)
        users = result.scalars().all()
        return users


async def initialize_test_user_data():
    async with async_session() as session:
        async with session.begin():
            session.add_all(
                [
                    User("user1"),
                    User("user2"),
                ]
            )
    return {"message": "Users table initialized with example rows."}


def parse_message(message: str) -> dict:
    # The message is a json string, turn it into a dictionary
    try:
        message_dict = json.loads(message)
    except json.JSONDecodeError:
        print("Error parsing message")
        return {"error": "Invalid JSON format"}
    return message_dict


async def save_sample_to_db(message: str):
    message_dict = parse_message(message)
    if "error" in message_dict:
        return

    async with async_session() as session:
        async with session.begin():
            session.add_all([message_dict["name"]])

    print("Inserting data into the database")
