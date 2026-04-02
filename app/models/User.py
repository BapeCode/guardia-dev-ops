from datetime import datetime
from app import database
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Text, DATETIME


class User(database.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    biography: Mapped[str] = mapped_column(Text, default="")
    location: Mapped[str] = mapped_column(String(120), default="")
    banner: Mapped[str] = mapped_column(String(120), default="")
    avatar: Mapped[str] = mapped_column(String(120), default="")
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.utcnow, onupdate=datetime.utcnow)

