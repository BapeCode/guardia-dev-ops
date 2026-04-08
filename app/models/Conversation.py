from __future__ import annotations
from datetime import datetime
from typing import Optional, List

from sqlalchemy import Text, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import database
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.User import User

class Conversation(database.Model):
    __tablename__ = "conversation"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    members: Mapped[List["ConversationMember"]] = relationship("ConversationMember", back_populates="conversation",
                                                               lazy="joined", cascade="all, delete-orphan")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="conversation", lazy="dynamic",
                                                     cascade="all, delete-orphan", order_by="Message.created_at.desc()")

    @property
    def last_message(self) -> Optional["Message"]:
        return self.messages.first()

    def to_dict(self, current_user=None) -> dict:
        return {
            "id": self.id,
            "members": [m.user.to_dict() for m in self.members],
            "last_message": self.last_message.to_dict() if self.last_message else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Conversation {self.id}>"


class ConversationMember(database.Model):
    __tablename__ = "conversation_member"

    id: Mapped[int] = mapped_column(primary_key=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversation.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="members")
    user: Mapped["User"] = relationship("User")

    __table_args__ = (
        UniqueConstraint("conversation_id", "user_id", name="uq_conversation_member"),
    )

    def __repr__(self) -> str:
        return f"<Member User {self.user_id} in Conv {self.conversation_id}>"


class Message(database.Model):
    __tablename__ = "message"

    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversation.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    sender: Mapped["User"] = relationship("User")
    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "sender": self.sender.to_dict(),
            "content": self.content,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self) -> str:
        return f"<Message {self.id} from User {self.sender_id}>"

