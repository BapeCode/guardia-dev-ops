from flask import Blueprint, request, render_template
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


@home_bp.route("/subscribe", methods=["GET", "POST"])
def subscribe():
    plan_name = request.args.get("plan", "")
    plan_price = float(request.args.get("price", 0))
    return render_template(
        "/home/subscribe.html", plan_name=plan_name, plan_price=plan_price
    )
