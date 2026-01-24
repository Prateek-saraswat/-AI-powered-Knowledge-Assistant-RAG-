from functools import wraps
from flask import request, jsonify


def validate_json(required_fields=None):
    required_fields = required_fields or []

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            data = request.get_json()

            if not data:
                return jsonify({"error": "Request body must be JSON"}), 400

            missing = [field for field in required_fields if field not in data]
            if missing:
                return jsonify({
                    "error": "Missing required fields",
                    "fields": missing
                }), 400

            return fn(*args, **kwargs)
        return wrapper
    return decorator
