from flask import redirect, url_for, flash, request, render_template

from app import database
from app.models import Like
from app.models import Post
from app.models import User
from app.models.Followers import Repost
from app.validator.PostValidator import PostValidator


class PostControllers:

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
    def get_post(current_user):
        if not current_user:
            return redirect(url_for("dashboard.index", tab="fill"))
        posts = (Post.query
                 .order_by(Post.id.desc())
                 .all()
                 )
        return posts

    @staticmethod
    def create(current_user):
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

        posts = PostControllers.get_post(current_user)
        all_users = User.query.all()
        return redirect(url_for("dashboard.index", tab="fill", current_user=current_user,
                                posts=[p.to_dict(current_user) for p in posts]), all_users=all_users)

    @staticmethod
    def like(current_user, post_id):
        post = Post.query.get_or_404(post_id)
        existing = Like.query.filter_by(user_id=current_user.id, post_id=post.id).first()
        if existing:
            database.session.delete(existing)
        else:
            database.session.add(Like(user_id=current_user.id, post_id=post.id))

        database.session.commit()
        return render_template("partials/posts_cards.html", post=post, current_user=current_user)

    @staticmethod
    def repost(current_user, post_id):
        post = Post.query.get_or_404(post_id)
        existing = Repost.query.filter_by(user_id=current_user.id, post_id=post.id).first()
        if existing:
            database.session.delete(existing)
        else:
            database.session.add(Repost(user_id=current_user.id, post_id=post.id))

        database.session.commit()
        return render_template("partials/posts_cards.html", post=post, current_user=current_user)
