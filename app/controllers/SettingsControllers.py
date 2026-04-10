from flask import render_template, request, flash, redirect, url_for
from app import database
from app.models.User import User


class SettingsControllers:
    @staticmethod
    def settings_render(current_user):
        """
        Gère l'affichage de la page des paramètres (Méthode GET)
        """
        return render_template("dashboard/pages/settings.html", current_user=current_user)

    @staticmethod
    def settings_update(current_user):
        """
        Gère la mise à jour des données du formulaire (Méthode POST)
        """
        email = request.form.get("email")
        new_password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        # 1. Traitement de l'email
        if email and email != current_user.email:
            existing_user = User.query.filter(
                User.email == email, User.id != current_user.id
            ).first()
            if existing_user:
                flash("Cette adresse email est déjà utilisée.", "error")
            else:
                current_user.email = email

        # 2. Traitement du mot de passe
        if new_password:
            if new_password == confirm_password:
                current_user.set_password(new_password)
                flash("Mot de passe mis à jour avec succès.", "success")
            else:
                flash("Les mots de passe ne correspondent pas.", "error")

        # 3. Sauvegarde des modifications en base de données
        database.session.commit()
        flash("Paramètres enregistrés.", "success")

        # 4. Redirection vers la page des paramètres pour voir les changements
        return redirect(url_for("settings.settings"))
