from flask import Blueprint, request, jsonify

auth_bp = Blueprint("users", __name__)

@auth_bp.route("/api/login", methods=['POST'])
def login():
    data = request.json()

    print(data)

    return jsonify({"message": "user created"})