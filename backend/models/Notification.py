import datetime
from ..database import db


class Notification(db.Model):
    __tablename__ = 'notification'

    # Notification types
    TYPE_LIKE = 'like'
    TYPE_COMMENT = 'comment'
    TYPE_FOLLOW = 'follow'
    TYPE_REPOST = 'repost'
    TYPE_MENTION = 'mention'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)       # who receives
    actor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)       # who triggered
    type = db.Column(db.String(20), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    # --- Relationships ---
    actor = db.relationship('User', foreign_keys=[actor_id])
    post = db.relationship('Post')
    comment = db.relationship('Comment')

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'actor': self.actor.to_dict(),
            'post_id': self.post_id,
            'comment_id': self.comment_id,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat(),
        }

    def __repr__(self):
        return f'<Notification {self.type} for User {self.user_id}>'