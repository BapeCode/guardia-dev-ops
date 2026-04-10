from __future__ import annotations
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import database
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Post import Post
    from app.models.Comment import Comment


class Like(database.Model):
    __tablename__ = "like"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    post_id: Mapped[Optional[int]] = mapped_column(ForeignKey("post.id"), nullable=True)
    comment_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("comment.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user: Mapped["User"] = relationship("User", back_populates="likes")
    post: Mapped[Optional["Post"]] = relationship("Post", back_populates="likes")
    comment: Mapped[Optional["Comment"]] = relationship(
        "Comment", back_populates="likes"
    )

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),
        UniqueConstraint("user_id", "comment_id", name="uq_user_comment_like"),
        CheckConstraint(
            "(post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)",
            name="ck_like_target",
        ),
    )

    def __repr__(self) -> str:
        target = (
            f"Post {self.post_id}" if self.post_id else f"Comment {self.comment_id}"
        )
        return f"<Like by User {self.user_id} on {target}>"
