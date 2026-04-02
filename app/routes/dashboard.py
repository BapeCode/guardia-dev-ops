from flask import Blueprint

from app.controllers.DashboardControllers import DashboardController
from app.decorators.auth import login_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
@login_required
def index(current_user):
    return DashboardController.index(current_user)