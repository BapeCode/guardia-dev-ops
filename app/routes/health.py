from flask import Response
from flask.sansio.blueprints import Blueprint

health_bp = Blueprint("health", __name__)

@health_bp.route("/")
def index():
    return Response('OK', status=200)