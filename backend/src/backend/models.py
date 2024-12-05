from sqlalchemy import Table, Column, Integer, String
from src.backend.db_controller import metadata

UserTable = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50)),
)
