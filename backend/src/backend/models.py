from sqlalchemy import Column, Integer, String
from src.backend.db_controller import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)

    def __init__(self, name):
        self.name = name
