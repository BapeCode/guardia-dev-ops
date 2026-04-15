from flask import Response, Blueprint

health_bp = Blueprint("health", __name__)


@health_bp.route("/", methods=["GET"])
def index():
    return Response("OK", status=200)
