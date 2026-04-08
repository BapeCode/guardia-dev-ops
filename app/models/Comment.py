from __future__ import annotations
from datetime import datetime
from typing import Optional, List

from sqlalchemy import Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import database
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Post import Post
    from app.models.Like import Like

class Comment(database.Model):
    __tablename__ = "comment"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    post_id: Mapped[int] = mapped_column(ForeignKey("post.id"), nullable=False)
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("comment.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    author: Mapped[List["User"]] = relationship("User", back_populates="comments")
    post: Mapped[List["Post"]] = relationship("Post", back_populates="comments")
    replies: Mapped[List["Comment"]] = relationship("Comment",
                                                    backref=database.backref("parent", remote_side="Comment.id"),
                                                    lazy="dynamic")
    likes: Mapped[List["Like"]] = relationship("Like", back_populates="comment", lazy="dynamic",
                                               cascade="all, delete-orphan")

    @property
    def like_count(self) -> int:
        return self.likes.count()

    def is_liked_by(self, user: "User") -> bool:
        return self.likes.filter_by(user_id=user.id).first() is not None

    def to_dict(self, current_user=None) -> dict:
        data = {
            "id": self.id,
            "content": self.content,
            "author": self.author.to_dict(),
            "post_id": self.post_id,
            "parent_id": self.parent_id,
            "like_count": self.like_count,
            "created_at": self.created_at.isoformat(),
            "is_liked": self.is_liked_by(current_user) if current_user else False,
        }
        return data

    def __repr__(self) -> str:
        return f"<Comment {self.id} on Post {self.post_id}>"

