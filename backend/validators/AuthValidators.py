from dataclasses import dataclass


@dataclass
class RegisterDTO:
    name: str
    username: str
    email: str
    password: str

    @classmethod
    def from_request(cls, data: dict) -> "RegisterDTO":
        errors = {}

        name = data.get("name", "").strip()
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not name: errors["name"] = ["Le nom est requis"]
        if not username: errors["username"] = ["Le nom d'utilisateur est requis"]
        if not email or "@" not in email:
            errors["email"] = ["L'email est requis et doit être valide"]
        if len(password) < 8:
            errors["password"] = ["Le mot de passe doit contenir 8 caractères minimum"]

        if errors:
            raise ValueError(errors)
        return cls(name, username, email, password)