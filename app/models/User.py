from __future__ import annotations
from datetime import datetime
from typing import Optional, List

from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import database
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.Post import Post
    from app.models.Like import Like
    from app.models.Comment import Comment
    from app.models.Followers import Follow
    from app.models.Followers import Repost


class User(database.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    biography: Mapped[str] = mapped_column(Text, default="")
    location: Mapped[str] = mapped_column(String(120), default="", server_default="")
    banner: Mapped[str] = mapped_column(String(255), default="", server_default="")
    avatar: Mapped[str] = mapped_column(String(255), default="", server_default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relations
    posts: Mapped[List["Post"]] = relationship(
        "Post", back_populates="author", lazy="dynamic"
    )
    comments: Mapped[List["Comment"]] = relationship(
        "Comment", back_populates="author", lazy="dynamic"
    )
    likes: Mapped[List["Like"]] = relationship(
        "Like", back_populates="user", lazy="dynamic"
    )
    reposts: Mapped[List["Repost"]] = relationship(
        "Repost", back_populates="user", lazy="dynamic"
    )
    # payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="user", lazy="dynamic")
    following: Mapped[List["Follow"]] = relationship(
        "Follow",
        back_populates="follower",
        lazy="dynamic",
        foreign_keys="Follow.follower_id",
    )
    followers: Mapped[List["Follow"]] = relationship(
        "Follow",
        back_populates="followed",
        lazy="dynamic",
        foreign_keys="Follow.followed_id",
    )

    @property
    def followers_count(self) -> int:
        return self.followers.count()

    @property
    def following_count(self) -> int:
        return self.following.count()

    def is_following(self, user: "User") -> bool:
        return self.following.filter_by(followed_id=user.id).first() is not None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "biography": self.biography,
            "location": self.location,
            "banner": self.banner,
            "avatar": self.avatar,
            "followers_count": self.followers_count,
            "following_count": self.following_count,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self) -> str:
        return f"<User {self.id}: {self.username}>"
