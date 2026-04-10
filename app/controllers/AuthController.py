from flask import render_template, request, flash, url_for, redirect, make_response
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_jwt_cookies,
)

from app import database
from app.models.User import User
from app.validator.AuthValidator import AuthValidator


class AuthController:
    @staticmethod
    def login():
        if request.method == "POST":
            dto = AuthValidator.from_form(request.form)
            user: "User" = User.query.filter_by(
                email=dto.email, password=dto.password
            ).first()
            if not user:
                flash("Email ou mot de passe incorrect", "error")
            else:
                token = create_access_token(identity=str(user.id))
                response = make_response(redirect(url_for("dashboard.index")))
                set_access_cookies(response, token)
                return response

        return render_template("auth/login.html")

    @staticmethod
    def register():
        if request.method == "POST":
            dto = AuthValidator.from_form_register(request.form)
            if dto is None:
                return render_template("auth/register.html")

            current_user = User.query.filter_by(
                email=dto.email, password=dto.password
            ).first()
            if current_user:
                flash("Email déjà utilisé", "error")
                return render_template("auth/register.html")
            else:
                new_user = User(
                    email=dto.email,
                    password=dto.password,
                    name=dto.name,
                    username=dto.username,
                )
                database.session.add(new_user)
                database.session.commit()
                return render_template("auth/login.html")

        return render_template("auth/register.html")

    @staticmethod
    def logout():
        response = make_response(redirect(url_for("auth.login")))
        unset_jwt_cookies(response)
        return response
