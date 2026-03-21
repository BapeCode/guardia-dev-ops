import datetime
from ..database import db


class Repost(db.Model):
    __tablename__ = 'repost'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='uq_user_repost'),
    )

    def __repr__(self):
        return f'<Repost by User {self.user_id} of Post {self.post_id}>'