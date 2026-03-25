from flask import Flask, jsonify, request, Blueprint

from backend.models import Post

post_bp = Blueprint("post", __name__)

@post_bp.route("/post", methods=['GET'])
def post():
    post = Post.query.all()
    return jsonify({
        "post": post,
    })