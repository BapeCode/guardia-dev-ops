import datetime
from ..database import db


class Like(db.Model):
    __tablename__ = 'like'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='uq_user_post_like'),
        db.UniqueConstraint('user_id', 'comment_id', name='uq_user_comment_like'),
        db.CheckConstraint(
            '(post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)',
            name='ck_like_target'
        ),
    )

    def __repr__(self):
        target = f'Post {self.post_id}' if self.post_id else f'Comment {self.comment_id}'
        return f'<Like by User {self.user_id} on {target}>'