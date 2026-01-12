from flask import Blueprint, request, jsonify
from app.services.chat_service import ChatService
from app.middlewares.auth_middleware import jwt_required
import app.extensions as extensions

chat_bp = Blueprint("chat", __name__)
chat_service = ChatService()


@chat_bp.route("/ask", methods=["POST"])
@jwt_required
def ask_question():
    data = request.get_json()

    if not data or "question" not in data:
        return jsonify({"error": "Question is required"}), 400

    question = data["question"]
    user_id = request.user["userId"]

    try:
        result = chat_service.ask_question(question, user_id)
        return jsonify(result), 200
    except Exception as e:
        print("❌ Chat error:", str(e))
        return jsonify({"error": str(e)}), 500


@chat_bp.route("/history", methods=["GET"])
@jwt_required
def chat_history():
    user_id = request.user["userId"]

    messages = list(
        extensions.db.chat_messages
        .find({"userId": user_id}, {"_id": 0})
        .sort("createdAt", -1)
        .limit(20)
    )

    return jsonify({
        "count": len(messages),
        "messages": messages
    }), 200
