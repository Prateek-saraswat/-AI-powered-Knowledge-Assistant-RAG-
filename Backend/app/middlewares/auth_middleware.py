from functools import wraps
from flask import request, jsonify
import jwt
from app.config import Config

def jwt_required(role=None):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")

            if not auth_header:
                return jsonify({"error": "Authorization header missing"}), 401

            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
                payload = jwt.decode(
                token,
                Config.JWT_SECRET,
                algorithms=["HS256"]
                )

                request.user = {
                "userId": payload["userId"],
                "email": payload["email"],
                "role": payload.get("role", "user")
                }

                if role and request.user["role"] != role:
                    return jsonify(
                        {"error": f"{role} access required"}
                    ), 403


            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except Exception as e:
                return jsonify({"error": "Invalid token", "details": str(e)}), 401

            return fn(*args, **kwargs)

        return wrapper
    return decorator
