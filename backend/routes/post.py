from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import null
from ..models import User, Post, Repost, Like
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
@jwt_required()
def post():
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    allpost = Post.query.order_by(Post.created_at.desc()).all()

    return jsonify({
        "post": [p.to_dict(current_user) for p in allpost],
    })

@post_bp.route("/posts/user", methods=['GET'])
@jwt_required()
def post_by_user():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({
            "error": "L'utilisateur n'existe pas"
        })

    my_post = Post.query.filter_by(author_id=current_user_id).order_by(Post.created_at.desc())
    return jsonify({
        "posts": [p.to_dict(user) for p in my_post],
    })

@post_bp.route("/posts/create", methods=['POST'])
@jwt_required()
def post_create():
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({"error": "L'utilisateur n'existe pas"})

    data = request.get_json()
    content = data["content"]

    new_post = Post(title="", content=content, author_id=current_user_id)
    db.session.add(new_post)
    db.session.commit()
    db.session.refresh(new_post)

    return jsonify({
        "post": new_post.to_dict(current_user),
    })

@post_bp.route("/posts/delete", methods=['POST'])
@jwt_required()
def post_delete():
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({"error": "L'utilisateur n'existe pas"})

    data = request.get_json()
    post_id = data["post_id"]

    current_post = Post.query.filter_by(author_id=current_user_id, id=post_id).first()
    if not current_post:
        return jsonify({"error": "L'utilisateur ou le post n'existe pas"})

    db.session.delete(current_post)
    db.session.commit()
    return jsonify({"is_deleted": True}), 200

@post_bp.route("/posts/<int:post_id>/<string:type>", methods=["POST"])
@jwt_required()
def post_update(post_id, type):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({
            "error": "L'utilisateur n'existe pas"
        })

    post = Post.query.get(post_id)

    if type == "like":
        existing_like = Like.query.filter_by(user_id=current_user_id, post_id=post_id).first()
        if existing_like:
            db.session.delete(existing_like)
            db.session.commit()
            return jsonify({"is_liked": False, "like_count": post.likes.count()})
        db.session.add(Like(user_id=current_user_id, post_id=post_id, comment_id=null()))
        db.session.commit()
        return jsonify({"is_liked": True, "like_count": post.likes.count()})
    elif type == "repost":
        existing_repost = Repost.query.filter_by(user_id=current_user_id, post_id=post_id).first()
        if existing_repost:
            db.session.delete(existing_repost)
            db.session.commit()
            return jsonify({"is_repost": False, "repost_count": post.repost_count})
        db.session.add(Repost(user_id=current_user_id, post_id=post_id))
        db.session.commit()
        return jsonify({"is_repost": True, "repost_count": post.repost_count})
    else:
        return jsonify({
            "error": "Type d'action non valide"
        }), 400

@post_bp.route("/posts/<string:type>", methods=["GET"])
@jwt_required()
def post_by_type(type):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({
            "error": "L'utilisateur n'existe pas"
        })

    if type == "like":
        all_like = (Post.query
                    .join(Like, Like.post_id == Post.id)
                    .filter(Like.user_id == current_user_id)
                    .filter(Like.post_id != null())
                    .order_by(Post.created_at.desc())
                    .all()
        )
        return jsonify({
            "posts": [p.to_dict(user) for p in all_like],
        })
    elif type == "repost":
        all_repost = (Post.query
                      .join(Repost, Repost.post_id == Post.id)
                      .filter(Repost.user_id == current_user_id)
                      .filter(Repost.post_id != null())
                      .order_by(Repost.created_at.desc())
                      .all()
        )
        return jsonify({
            "posts": [p.to_dict(user) for p in all_repost],
        })
    else:
        return jsonify({
            "error": "Type d'action non valide"
        })