from flask import Blueprint, request, jsonify
from ..model.User import User

auth_bp = Blueprint("users", __name__)

@auth_bp.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404
    elif user.password != password:
        return jsonify({"message": "Incorrect password"}), 401
    else:
        return jsonify({"message": "Login successful", "user": {"id": user.id, "name": user.name, "email": user.email}}), 200