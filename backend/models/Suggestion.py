import datetime
from ..database import db


class Suggestion(db.Model):
    __tablename__ = 'suggestion'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    suggested_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    score = db.Column(db.Float, default=0.0)
    dismissed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    user = db.relationship('User', foreign_keys=[user_id])
    suggested_user = db.relationship('User', foreign_keys=[suggested_user_id])

    __table_args__ = (
        db.UniqueConstraint('user_id', 'suggested_user_id', name='uq_suggestion'),
        db.CheckConstraint('user_id != suggested_user_id', name='ck_no_self_suggest'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'suggested_user': self.suggested_user.to_dict(),
            'score': self.score,
            'created_at': self.created_at.isoformat(),
        }

    def __repr__(self):
        return f'<Suggestion User {self.suggested_user_id} for User {self.user_id}>'