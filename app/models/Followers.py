from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Float, Boolean, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import database


class Follow(database.Model):
    __tablename__ = "follow"

    id: Mapped[int] = mapped_column(primary_key=True)
    follower_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    followed_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    follower: Mapped["User"] = relationship("User", foreign_keys=[follower_id], back_populates="following")
    followed: Mapped["User"] = relationship("User", foreign_keys=[followed_id], back_populates="followers")

    __table_args__ = (
        UniqueConstraint("follower_id", "followed_id", name="uq_follow"),
        CheckConstraint("follower_id != followed_id", name="ck_no_self_follow"),
    )

    def __repr__(self) -> str:
        return f"<Follow {self.follower_id} -> {self.followed_id}>"


class Repost(database.Model):
    __tablename__ = "repost"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    post_id: Mapped[int] = mapped_column(ForeignKey("post.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user: Mapped["User"] = relationship("User", back_populates="reposts")
    post: Mapped["Post"] = relationship("Post", back_populates="reposts")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_repost"),
    )

    def __repr__(self) -> str:
        return f"<Repost by User {self.user_id} of Post {self.post_id}>"


class Suggestion(database.Model):
    __tablename__ = "suggestion"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    suggested_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    dismissed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    suggested_user: Mapped["User"] = relationship("User", foreign_keys=[suggested_user_id])

    __table_args__ = (
        UniqueConstraint("user_id", "suggested_user_id", name="uq_suggestion"),
        CheckConstraint("user_id != suggested_user_id", name="ck_no_self_suggest"),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "suggested_user": self.suggested_user.to_dict(),
            "score": self.score,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self) -> str:
        return f"<Suggestion User {self.suggested_user_id} for User {self.user_id}>"
