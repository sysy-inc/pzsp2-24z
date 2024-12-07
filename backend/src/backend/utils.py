import json

from src.backend.models import UserTable
from src.backend.db_controller import database


async def fetch_user_data():
    query = UserTable.select()
    return await database.fetch_all(query)


async def initialize_test_user_data():
    insert_query = UserTable.insert().values(
        [
            {"name": "user1"},
            {"name": "user2"},
        ]
    )
    await database.execute(insert_query)
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

    insert_query = UserTable.insert().values(
        [
            {"name": message_dict["name"]},
        ]
    )

    print("Inserting data into the database")
    await database.execute(insert_query)
