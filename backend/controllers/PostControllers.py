from flask import jsonify, request
from ..models.Post import Post
from ..validators.PostValidators import CreatePostDTO
from ..database import db

class PostControllers:

    @staticmethod
    def index(current_user):
        print("PostControllers::index")
        posts = Post.query.order_by(Post.created_at.desc()).all()
        return jsonify({
            "posts": [p.to_dict() for p in posts]
        }), 200

    @staticmethod
    def create(current_user):
        print("PostControllers::create")
        try:
            dto = CreatePostDTO(request.get_json())
        except ValueError as e:
            return jsonify({"errors": e.args[0]}), 422

        post = Post(title="", content=dto.content, author_id=current_user.id)
        db.session.add(post)
        db.session.commit()
        db.session.refresh(post)

        return jsonify({"post": post.to_dict()}), 201

    @staticmethod
    def delete(current_user, post_id: int):
        post = Post.query.filter_by(id=post_id, author_id=current_user.id).first()
        if not post:
            return jsonify({"error": "Post introuvable"}), 404

        db.session.delete(post)
        db.session.commit()
        return jsonify({"deleted": True}), 200