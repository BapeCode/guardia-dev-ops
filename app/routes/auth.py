from flask import Blueprint

from app.controllers.AuthController import AuthController

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    return AuthController.login()

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    return AuthController.register()