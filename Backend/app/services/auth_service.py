import bcrypt
from datetime import datetime
import app.extensions as extensions
from app.utils.jwt_helper import generate_token


class AuthService:
    def __init__(self):
        if extensions.db is None:
            raise RuntimeError("MongoDB not initialized")

        self.users = extensions.db.users

    def register(self, email: str, password: str):
        existing_user = self.users.find_one({"email": email})
        if existing_user:
            raise ValueError("User already exists")

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        self.users.insert_one({
            "email": email,
            "password": hashed_password,
            "role": "user",
            "createdAt": datetime.utcnow()
        })

        return {"message": "User registered successfully"}

    def login(self, email: str, password: str):
        user = self.users.find_one({"email": email})
        if not user:
            raise ValueError("Invalid credentials")

        if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            raise ValueError("Invalid credentials")

        token = generate_token({
            "userId": str(user["_id"]),
            "email": user["email"],
            "role": user["role"]
        })

        return {
            "token": token,
            "email": user["email"]
        }
