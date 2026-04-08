from flask import Blueprint

from app.controllers.DashboardControllers import DashboardController
from app.decorators.auth import login_required

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET", "POST"])
@login_required
def index(current_user):
    return DashboardController.index(current_user)


@dashboard_bp.route("/dashboard/profile", methods=["GET", "POST"])
@login_required
def profile(current_user):
    return DashboardController.profile(current_user)


@dashboard_bp.route("/dashboard/<int:user_id>/profile", methods=["GET", "POST"])
@login_required
def other_profile(current_user, user_id):
    return DashboardController.other_profile(current_user, user_id)

@dashboard_bp.route("/dashboard/<int:user_id>/follow", methods=["POST"])
@login_required
def follow(current_user, user_id):
    return DashboardController.follow(current_user, user_id)

@dashboard_bp.route("/dashboard/profile_edit", methods=["GET", "POST"])
@login_required
def profile_edit(current_user):
    return DashboardController.profil_edit(current_user)


@dashboard_bp.route("/dashboard/messages", methods=["GET", "POST"])
@login_required
def messages(current_user):
    return DashboardController.messages(current_user)
