import datetime
from ..database import db

class Post(db.Model):
    __tablename__ = 'post'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    likes = db.relationship('Like', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    reposts = db.relationship('Repost', backref='post', lazy='dynamic', cascade='all, delete-orphan')

    @property
    def like_count(self):
        return self.likes.count()

    @property
    def comment_count(self):
        return self.comments.count()

    @property
    def repost_count(self):
        return self.reposts.count()

    def is_liked_by(self, user):
        return self.likes.filter_by(user_id=user.id).first() is not None

    def is_reposted_by(self, user):
        return self.reposts.filter_by(user_id=user.id).first() is not None

    def to_dict(self, current_user=None):
        data = {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'author': self.author.to_dict(),
            'like_count': self.like_count,
            'comment_count': self.comment_count,
            'repost_count': self.repost_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if current_user:
            data['is_liked'] = self.is_liked_by(current_user)
            data['is_reposted'] = self.is_reposted_by(current_user)
        return data

    def __repr__(self):
        return f'<Post {self.id}: {self.title[:30]}>'