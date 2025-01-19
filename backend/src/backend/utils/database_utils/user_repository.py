from typing import List

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.backend.utils.database_utils.models import User, UserSchema


class DuplicateUserError(Exception):
    """Raised when a user with the same email already exists."""

    pass


class UserNotFoundError(Exception):
    """Raised when a user is not found in the database."""

    pass


class UserRepository:
    @staticmethod
    def add_user(db_session: Session, user_data: UserSchema) -> User:
        """Add a new user to the database."""
        new_user = User(
            name=user_data.name,
            surname=user_data.surname,
            email=user_data.email,
            hashed_pwd=user_data.hashed_pwd,
            is_admin=user_data.is_admin,
        )
        try:
            db_session.add(new_user)
            db_session.commit()
            db_session.refresh(new_user)
        except IntegrityError as e:
            print(e)
            db_session.rollback()
            raise DuplicateUserError("A user with this email already exists.")
        return new_user

    @staticmethod
    def get_users(db_session: Session) -> List[User]:
        """Fetch all users from the database."""
        return db_session.query(User).all()

    @staticmethod
    def get_user(db_session: Session, user_id: int) -> User:
        """Fetch a user by their ID. Raise UserNotFoundError if not found."""
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundError(f"User with ID {user_id} not found.")
        return user

    @staticmethod
    def get_user_by_email(db_session: Session, email: str) -> User:
        """Fetch a user by their username (name field). Raise UserNotFoundError if not found."""
        user = db_session.query(User).filter(User.email == email).first()
        if not user:
            raise UserNotFoundError(f"User with email '{email}' not found.")
        return user

    @staticmethod
    def delete_user(db_session: Session, user_id: int) -> bool:
        """Delete a user by their ID. Raise UserNotFoundError if not found."""
        user = UserRepository.get_user(
            db_session, user_id
        )  # Will raise UserNotFoundError if user doesn't exist
        db_session.delete(user)
        db_session.commit()
        return True
