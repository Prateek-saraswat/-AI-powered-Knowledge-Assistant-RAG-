from flask import Blueprint, request, jsonify
from app.services.chat_service import ChatService
from app.middlewares.auth_middleware import jwt_required
import app.extensions as extensions
from bson import ObjectId
from bson.errors import InvalidId

chat_bp = Blueprint("chat", __name__)
chat_service = ChatService()


def serialize_message(msg):
    """Convert MongoDB ObjectIds to strings for JSON serialization"""
    return {
        'id': str(msg.get('_id')) if msg.get('_id') else None,
        'userId': str(msg.get('userId')) if msg.get('userId') else None,
        'documentId': str(msg.get('documentId')) if msg.get('documentId') else None,
        'question': msg.get('question'),
        'answer': msg.get('answer'),
        'createdAt': msg.get('createdAt').isoformat() if msg.get('createdAt') else None,
        'updatedAt': msg.get('updatedAt').isoformat() if msg.get('updatedAt') else None
    }


@chat_bp.route("/ask", methods=["POST"])
@jwt_required
def ask_question():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body required"}), 400

    if "question" not in data or "documentId" not in data:
        return jsonify({
            "error": "Both question and documentId are required"
        }), 400

    question = data["question"]
    document_id = data["documentId"]
    user_id = request.user["userId"]

    try:
        document_object_id = ObjectId(document_id)
    except InvalidId:
        return jsonify({"error": "Invalid documentId"}), 400

    document = extensions.db.documents.find_one({
        "_id": document_object_id,
        "userId": ObjectId(user_id),
        "enabled": True
    })

    if not document:
        return jsonify({
            "error": "Document not found or access denied"
        }), 404

    try:
        result = chat_service.ask_question(
            question=question,
            user_id=user_id,
            document_id=document_id
        )
        return jsonify(result), 200

    except Exception as e:
        print("Chat error:", str(e))
        return jsonify({"error": str(e)}), 500



@chat_bp.route("/history", methods=["GET"])
@jwt_required
def chat_history():
    user_id = request.user["userId"]
    document_id = request.args.get("documentId")

    if not document_id:
        return jsonify({
            "error": "documentId query param is required"
        }), 400

    try:
        document_object_id = ObjectId(document_id)
    except InvalidId:
        return jsonify({"error": "Invalid documentId"}), 400

    messages = list(
        extensions.db.chat_messages
        .find(
            {
                "userId": ObjectId(user_id),
                "documentId": document_object_id
            }
        )
        .sort("createdAt", 1)  
    )

    serialized_messages = [serialize_message(msg) for msg in messages]

    return jsonify({
        "success": True,
        "count": len(serialized_messages),
        "messages": serialized_messages
    }), 200