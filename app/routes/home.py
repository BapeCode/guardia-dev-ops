from flask import Blueprint
from app.controllers.HomeControllers import HomeController

home_bp = Blueprint("home", __name__)


@home_bp.route("/", methods=["GET"])
def home():
    return HomeController.index()


@home_bp.route("/premium", methods=["GET"])
def premium():
    return HomeController.premium()


@home_bp.route("/features", methods=["GET"])
def features():
    return HomeController.features()
