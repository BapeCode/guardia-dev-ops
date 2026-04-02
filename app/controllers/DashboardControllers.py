from flask import render_template, request, flash, redirect, url_for

from app import database
from app.models.Post import Post
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
        return render_template('dashboard/index.html', current_user=current_user, tab="fill",
                               posts=[p.to_dict(current_user) for p in posts])

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
