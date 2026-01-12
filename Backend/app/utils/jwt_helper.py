import jwt
import os
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_EXPIRY_MINUTES = 60


def generate_token(payload: dict):
    payload["exp"] = datetime.utcnow() + timedelta(minutes=JWT_EXPIRY_MINUTES)

    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token


def decode_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
