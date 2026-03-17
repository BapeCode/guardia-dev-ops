from flask import Blueprint, request, jsonify

user_bp = Blueprint("users", __name__)

@user_bp.route("/api/login", methods=['POST'])
def login():
    data = request.json()

    print(data)

    return jsonify({"message": "user created"})