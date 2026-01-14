import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

import app.extensions as extensions
from app.config import Config


class AuthService:
    def register(self, email: str, password: str , name:str):
        existing = extensions.db.users.find_one({"email": email})
        if existing:
            raise ValueError("User already exists")

        user = {
            "name": name,
            "email": email,
            "password": generate_password_hash(password),  
            "role": "user",
            "createdAt": datetime.utcnow()
        }

        extensions.db.users.insert_one(user)

        return {"message": "User registered successfully"}

    def login(self, email: str, password: str):
        user = extensions.db.users.find_one({"email": email})

        if not user:
            raise ValueError("Invalid email or password")

        stored_password = user["password"]

        if isinstance(stored_password, bytes):
            stored_password = stored_password.decode("utf-8")

        if not check_password_hash(stored_password, password):
            raise ValueError("Invalid email or password")

        payload = {
            "userId": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "user"),
            "exp": datetime.utcnow() + timedelta(hours=24)
        }

        token = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")

        return {
            "token": token,
            "user": {
                "userId": str(user["_id"]),
                "email": user["email"],
                "role": user.get("role", "user")
            }
        }
