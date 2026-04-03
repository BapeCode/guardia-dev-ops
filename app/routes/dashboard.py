from flask import Blueprint, request

from app.controllers.DashboardControllers import DashboardController
from app.decorators.auth import login_required

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET", "POST"])
@login_required
def index(current_user):
    tab = request.args.get("tab", "fill")

    if tab == "fill":
        return DashboardController.fill(current_user)

    return DashboardController.index(current_user, tab)


@dashboard_bp.route("/dashboard/posts/<int:post_id>/delete", methods=["GET"])
@login_required
def delete_post(current_user, post_id):
    return DashboardController.delete_post(current_user, post_id)


@dashboard_bp.route("/dashboard/profile", methods=["GET", "POST"])
@login_required
def profile(current_user):
    return DashboardController.profil(current_user)


@dashboard_bp.route("dashboard/profile_edit", methods=["GET", "POST"])
@login_required
def profile_edit(current_user):
    return DashboardController.profil_edit(current_user)
