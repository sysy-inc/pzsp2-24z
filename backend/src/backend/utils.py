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
