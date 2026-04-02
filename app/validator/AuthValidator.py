from dataclasses import dataclass

from flask import flash


@dataclass
class AuthValidator:
    email: str
    password: str
    name: str
    username: str

    @classmethod
    def from_form(cls, form) -> "AuthValidator":
        errors = {}
        email = form.get("auth_email", "").strip()
        password = form.get("auth_password", "")

        if not email or '@' not in email:
            errors["error"] = "Veuillez entrer une adresse email valide"
        if len(password) < 8:
            errors["error"] = "Le mots de passe doit contenir 8 caractères minimum"

        if errors:
            flash(errors["error"], "error")

        return cls(email=email, password=password, name="", username="")

    @classmethod
    def from_form_register(cls, form) -> "AuthValidator | None":
        valid = True
        name = form.get("auth_name", "")
        username = form.get("auth_username", "")
        email = form.get("auth_email", "").strip()
        password = form.get("auth_password", "")

        if not email or '@' not in email:
            flash("Veuillez entrer une adresse email valide", "error")
            valid = False
        if len(password) < 8:
            flash("Le mots de passe doit contenir 8 caractères minimum", "error")
            valid = False
        if not name:
            flash("Veuillez entrer un nom", "error")
            valid = False
        if not username:
            flash("Veuillez entrer un nom d'utilisateur", "error")
            valid = False

        if not valid:
            return None

        return cls(email=email, password=password, name=name, username=username)