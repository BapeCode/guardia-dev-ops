from ..instance.db import db

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    like_amount = db.Column(db.Integer, default=0)
    repost_amount = db.Column(db.Integer, default=False)

    author = db.relationship('User', backref=db.backref('posts', lazy=True))