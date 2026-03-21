import datetime
from ..database import db


class Conversation(db.Model):
    __tablename__ = 'conversation'

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # --- Relationships ---
    members = db.relationship('ConversationMember', backref='conversation', lazy='joined', cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='conversation', lazy='dynamic', cascade='all, delete-orphan',
                               order_by='Message.created_at.desc()')

    @property
    def last_message(self):
        return self.messages.first()

    def to_dict(self, current_user=None):
        return {
            'id': self.id,
            'members': [m.user.to_dict() for m in self.members],
            'last_message': self.last_message.to_dict() if self.last_message else None,
            'updated_at': self.updated_at.isoformat(),
        }

    def __repr__(self):
        return f'<Conversation {self.id}>'


class ConversationMember(db.Model):
    __tablename__ = 'conversation_member'

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    joined_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    user = db.relationship('User')

    __table_args__ = (
        db.UniqueConstraint('conversation_id', 'user_id', name='uq_conversation_member'),
    )

    def __repr__(self):
        return f'<Member User {self.user_id} in Conv {self.conversation_id}>'


class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'sender': self.sender.to_dict(),
            'content': self.content,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat(),
        }

    def __repr__(self):
        return f'<Message {self.id} from User {self.sender_id}>'