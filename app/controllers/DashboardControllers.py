from flask import render_template, request, flash, redirect, url_for

from app import database
from app.models.Post import Post
from app.models.User import User
from app.services.uploads_services import encrypt_filename, upload
from app.services.uploads_services import harvest_file
from app.validator.PostValidator import PostValidator


class DashboardController:
    TABS = ["fill", "messages", "profil", "settings"]

    @staticmethod
    def index(current_user, tab="fill"):
        if tab not in DashboardController.TABS:
            tab = "fill"

        if tab == "fill":
            DashboardController.fill(current_user)

        return render_template('dashboard/index.html', current_user=current_user, tab=tab, posts=[])

    @staticmethod
    def fill(current_user):
        if request.method == "POST":
            dto = PostValidator.from_form(request.form)
            new_post = Post(
                title="",
                content=dto.content,
                author_id=current_user.id
            )
            database.session.add(new_post)
            database.session.commit()
            database.session.refresh(new_post)
            flash("Post publié !")
            return redirect(url_for("dashboard.index", tab="fill"))

        posts = Post.query.order_by(Post.created_at.desc()).all()
        all_users = User.query.filter_by(id=not current_user.id).all()
        return render_template('dashboard/index.html', current_user=current_user, tab="fill",
                               posts=[p.to_dict(current_user) for p in posts], all_users=all_users)

    @staticmethod
    def delete_post(current_user, post_id):
        if not current_user:
            return redirect(url_for("dashboard.index", tab="fill"))

        deleted_post = Post.query.get(post_id)
        if not deleted_post:
            flash("Post introuvable", "error")
            return redirect(url_for("dashboard.index", tab="fill"))

        database.session.delete(deleted_post)
        database.session.commit()
        flash("Post supprimé", "success")
        return redirect(url_for("dashboard.index", tab="fill"))

    @staticmethod
    def profil(current_user):
        return render_template("dashboard/tab/profil.html", current_user=current_user)

    @staticmethod
    def profil_edit(current_user):
        if request.method == "POST":
            errors = False
            username = request.form["user_username"]
            location = request.form["user_location"]
            bio = request.form["user_bio"]
            avatar = request.files.get("user_avatar")
            banner = request.files.get("user_banner")

            if avatar and avatar.filename != "":
                harvest_file(avatar.filename)
                filename, status = encrypt_filename(avatar)
                if not status:
                    errors = True
                    flash(filename, "error")

                is_upload, message = upload(avatar, filename, "avatars", current_user.avatar)
                if not is_upload:
                    errors = True
                    flash(message, "error")
                current_user.avatar = f"{filename}"
                database.session.commit()
                database.session.refresh(current_user)

            if banner and banner.filename != "":
                harvest_file(banner.filename)
                filename, status = encrypt_filename(banner)
                if not status:
                    errors = True
                    flash(filename, "error")

                is_upload, message = upload(banner, filename, "banners", current_user.banner)
                if not is_upload:
                    errors = True
                    flash(message, "error")
                current_user.banner = f"{filename}"
                database.session.commit()
                database.session.refresh(current_user)

            if not username:
                username = current_user.username
            if not location:
                location = current_user.location
            if not bio:
                bio = current_user.biography

            updated_user = User.query.get(current_user.id)
            updated_user.username = username
            updated_user.location = location
            updated_user.biography = bio
            database.session.add(updated_user)
            database.session.commit()
            database.session.refresh(updated_user)

            if errors:
                return redirect(url_for("dashboard.profile_edit", current_user=current_user))

            return redirect(url_for("dashboard.profile", tab="fill", current_user=current_user))

        return render_template("dashboard/tab/profil_edit.html", current_user=current_user)
