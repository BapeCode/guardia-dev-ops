from flask import Blueprint

from app.controllers.SettingsControllers import SettingsControllers
from app.decorators.auth import login_required


settings_bp = Blueprint("settings", __name__)


@settings_bp.route("/settings/update", methods=["POST"])
@login_required
def update_settings(current_user):
    return SettingsControllers.settings_update(current_user)


@settings_bp.route("/parametres", methods=["GET"])
@login_required
def settings(current_user):
    return SettingsControllers.settings_render(current_user)
