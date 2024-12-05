from src.backend.models import UserTable
from src.backend.db_controller import database


async def fetch_example_data():
    query = UserTable.select()
    return await database.fetch_all(query)
