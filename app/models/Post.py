from __future__ import annotations
from datetime import datetime
from typing import Optional, List

from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import database
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Comment import Comment
    from app.models.Like import Like
    from app.models.Followers import Repost


class Post(database.Model):
    __tablename__ = "post"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relations
    author: Mapped["User"] = relationship("User", back_populates="posts")
    comments: Mapped[List["Comment"]] = relationship(
        "Comment", back_populates="post", lazy="dynamic", cascade="all, delete-orphan"
    )
    likes: Mapped[List["Like"]] = relationship(
        "Like", back_populates="post", lazy="dynamic", cascade="all, delete-orphan"
    )
    reposts: Mapped[List["Repost"]] = relationship(
        "Repost", back_populates="post", lazy="dynamic", cascade="all, delete-orphan"
    )

    # Propriétés calculées
    @property
    def like_count(self) -> int:
        return self.likes.count()

    @property
    def comment_count(self) -> int:
        return self.comments.count()

    @property
    def repost_count(self) -> int:
        return self.reposts.count()

    def is_liked_by(self, user: "User") -> bool:
        return self.likes.filter_by(user_id=user.id).first() is not None

    def is_reposted_by(self, user: "User") -> bool:
        return self.reposts.filter_by(user_id=user.id).first() is not None

    def to_dict(self, current_user=None) -> dict:
        data = {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "author": self.author.to_dict(),
            "like_count": self.like_count,
            "comment_count": self.comment_count,
            "repost_count": self.repost_count,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_liked": self.is_liked_by(current_user) if current_user else False,
            "is_reposted": self.is_reposted_by(current_user) if current_user else False,
        }
        return data

    def __repr__(self) -> str:
        return f"<Post {self.id}: {self.title[:30]}>"
