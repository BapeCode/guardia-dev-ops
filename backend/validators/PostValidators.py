# validators/PostValidator.py
from dataclasses import dataclass
from typing import Optional

@dataclass
class CreatePostDTO:
    content: str

    @classmethod
    def from_request(cls, data: dict) -> "CreatePostDTO":
        errors = {}
        content = data.get("content", "").strip()

        if not content:
            errors["content"] = "Le contenu est requis"
        if len(content) > 500:
            errors["content"] = "Maximum 500 caractères"

        if errors:
            raise ValueError(errors)

        return cls(content=content)