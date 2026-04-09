from dataclasses import dataclass

from flask import flash


@dataclass
class PostValidator:
    content: str

    @classmethod
    def from_form(cls, form) -> "PostValidator":
        errors = {}
        content = form.get("post_content", "")

        if len(content) == 0:
            errors["post_content"] = ["Le contenu du post ne peut pas être vide"]

        if errors:
            flash(errors["post_content"], "error")

        return cls(content=content)
