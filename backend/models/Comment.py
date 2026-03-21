import datetime
from ..database import db


class Comment(db.Model):
    __tablename__ = 'comment'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    likes = db.relationship('Like', backref='comment', lazy='dynamic', cascade='all, delete-orphan')

    @property
    def like_count(self):
        return self.likes.count()

    def is_liked_by(self, user):
        return self.likes.filter_by(user_id=user.id).first() is not None

    def to_dict(self, current_user=None):
        data = {
            'id': self.id,
            'content': self.content,
            'author': self.author.to_dict(),
            'post_id': self.post_id,
            'parent_id': self.parent_id,
            'like_count': self.like_count,
            'created_at': self.created_at.isoformat(),
        }
        if current_user:
            data['is_liked'] = self.is_liked_by(current_user)
        return data

    def __repr__(self):
        return f'<Comment {self.id} on Post {self.post_id}>'