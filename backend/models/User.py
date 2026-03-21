import datetime
from ..database import db

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.String(280), default="")
    locate = db.Column(db.String(80), default="")
    banner = db.Column(db.String(280), default="")
    avatar = db.Column(db.String(280), default="")
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    posts = db.relationship('Post', backref='author', lazy='dynamic')
    comments = db.relationship('Comment', backref='author', lazy='dynamic')
    likes = db.relationship('Like', backref='user', lazy='dynamic')
    reposts = db.relationship('Repost', backref='user', lazy='dynamic')
    notifications = db.relationship('Notification', foreign_keys='Notification.user_id', backref='user', lazy='dynamic')
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy='dynamic')

    followers = db.relationship(
        'Follow',
        foreign_keys='Follow.followed_id',
        backref=db.backref('followed_user', lazy='joined'),
        lazy='dynamic'
    )
    following = db.relationship(
        'Follow',
        foreign_keys='Follow.follower_id',
        backref=db.backref('follower_user', lazy='joined'),
        lazy='dynamic'
    )

    @property
    def followers_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.following.count()

    def is_following(self, user):
        return self.following.filter_by(followed_id=user.id).first() is not None

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'username': self.username,
            'bio': self.bio,
            'locate': self.locate,
            'banner': self.banner,
            'avatar': self.avatar,
            'followers_count': self.followers_count,
            'following_count': self.following_count,
            'created_at': self.created_at.isoformat(),
        }

    def __repr__(self):
        return f'<User @{self.username}>'
