from flask import Blueprint

from app.controllers.PostController import PostControllers
from app.decorators.auth import login_required

posts_bp = Blueprint("posts", __name__)


@posts_bp.route("/create", methods=["POST"])
@login_required
def create(current_user):
    return PostControllers.create(current_user)


@posts_bp.route("/<int:post_id>/delete", methods=["POST"])
@login_required
def delete(current_user, post_id):
    return PostControllers.delete_post(current_user, post_id)


@posts_bp.route("/<int:post_id>/like", methods=["POST"])
@login_required
def like(current_user, post_id):
    return PostControllers.like(current_user, post_id)


@posts_bp.route("/<int:post_id>/repost", methods=["POST"])
@login_required
def repost(current_user, post_id):
    return PostControllers.repost(current_user, post_id)


@posts_bp.route("/<int:post_id>/comment", methods=["POST"])
@login_required
def comment(current_user, post_id):
    return PostControllers.comment(current_user, post_id)


@posts_bp.route("/<int:post_id>/comment/<int:comment_id>/delete", methods=["POST"])
@login_required
def delete_comment(current_user, post_id, comment_id):
    return PostControllers.delete_comment(current_user, post_id, comment_id)
