from flask import Blueprint, request, jsonify
from ..model.User import User
from ..instance.db import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Utilisateur introuvable"}), 404
    elif user.password != password:
        return jsonify({"message": "Incorrect password"}), 401
    else:
        return jsonify({"message": "Login successful", "user": {"id": user.id, "name": user.name, "email": user.email}}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    fullName = data.get("fullName")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    user = User(email=email, name=fullName, username=username, password=password)   

    if user:
        return jsonify({"message": "Registration failed: email already used"}), 400
    else:
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Registration successful"}), 200
        