from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
import re
from app.extensions import limiter
from app.middlewares.validation_middleware import validate_json

auth_bp = Blueprint("auth", __name__)
auth_service = AuthService()


@auth_bp.route("/register", methods=["POST"])
@limiter.limit("5 per minute")
@validate_json(required_fields=["email", "password", "name"])
def register():
    data = request.get_json()

    

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    

    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify({"error": "Invalid email format"}), 400  # for email validati

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    if not any(c.isupper() for c in password):
        return jsonify({"error": "Password must contain an uppercase letter"}), 400
    
    if not any(c.islower() for c in password):
        return jsonify({"error": "Password must contain a lowercase letter"}), 400
    
    if not any(c.isdigit() for c in password):
        return jsonify({"error": "Password must contain a number"}), 400

    try:
        result = auth_service.register(email, password, name)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
@validate_json(required_fields=["email", "password"])
def login():
    data = request.get_json()

    

    email = data.get("email")
    password = data.get("password")

    

    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify({"error": "Invalid email format"}), 400

    try:
        result = auth_service.login(email,password)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
