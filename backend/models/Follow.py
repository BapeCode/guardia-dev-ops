import datetime
from ..database import db


class Follow(db.Model):
    __tablename__ = 'follow'

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('follower_id', 'followed_id', name='uq_follow'),
        db.CheckConstraint('follower_id != followed_id', name='ck_no_self_follow'),
    )

    def __repr__(self):
        return f'<Follow {self.follower_id} -> {self.followed_id}>'