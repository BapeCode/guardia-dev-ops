from flask import Flask, jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Post
from ..database import db

post_bp = Blueprint("post", __name__)

def get_post(posts):
    return {
        "id": posts.id,
        "title": posts.title,
        "content": posts.content,
        "author_id": posts.author_id,
        "created_at": posts.created_at,
        "updated_at": posts.updated_at,
        "likes": posts.likes.count(),
        "comments": posts.comments.count(),
        "reposts": posts.reposts.count(),
    }

@post_bp.route("/posts", methods=['GET'])
def post():
    allpost = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify({
        "post": [p.to_dict() for p in allpost],
    })

@post_bp.route("/posts/create", methods=['POST'])
@jwt_required()
def post_create():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({
            "error": "L'utilisateur n'existe pas"
        })

    data = request.get_json()
    content = data["content"]

    new_post = Post(title="", content=content, author_id=current_user_id)
    db.session.add(new_post)
    db.session.commit()
    return jsonify({
        "post": get_post(new_post),
    })