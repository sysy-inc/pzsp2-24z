from datetime import datetime, timedelta, timezone
from typing import Annotated, Any, Literal
from sqlalchemy.orm import Session

import jwt
from fastapi import APIRouter, Depends, HTTPException, WebSocket, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError

from src.backend.utils.database_utils.models import UserSchema, User
from src.backend.utils.database_utils.user_repository import (
    UserRepository,
    UserNotFoundError,
    DuplicateUserError,
)

from src.backend.utils.database_utils.db_controller import get_session

# TODO Replace with env variable from secrets
# Generate with:
# openssl rand -hex 32
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class RegisterRequest(BaseModel):
    name: str
    surname: str
    email: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


auth_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def authenticate_user(
    email: str, password: str, session: Session
) -> User | Literal[False]:
    """Authenticate a user by username and password."""
    try:
        user = UserRepository.get_user_by_email(session, email)
    except UserNotFoundError:
        return False

    if not verify_password(password, user.hashed_pwd):
        return False

    return user


def create_access_token(data: dict[Any, Any], expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # type: ignore
    return encoded_jwt


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)],
) -> User:
    """Get the current authenticated user from the token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # type: ignore
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception

    try:
        user = UserRepository.get_user_by_email(session, token_data.email)  # type: ignore
    except UserNotFoundError:
        raise credentials_exception

    return user


@auth_router.post("/token")
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)],
) -> Token:
    """Log in a user and return an access token."""
    user = authenticate_user(
        form_data.username,
        form_data.password,
        session,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@auth_router.post("/register")
def register_new_user(
    request: RegisterRequest,
    session: Annotated[Session, Depends(get_session)],
):
    """Register a new user."""
    hashed_pwd = get_password_hash(request.password)
    user = User(
        name=request.name,
        surname=request.surname,
        email=request.email,
        hashed_pwd=hashed_pwd,
        is_admin=False,
    )
    try:
        UserRepository.add_user(session, user)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists.",
        )

    return {"message": "User registered successfully"}
