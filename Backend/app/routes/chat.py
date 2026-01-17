from flask import Blueprint, request, jsonify
from app.services.chat_service import ChatService
from app.middlewares.auth_middleware import jwt_required
import app.extensions as extensions
from bson import ObjectId
from bson.errors import InvalidId
from app.extensions import limiter
from app.utils.serializer import serialize_dict

chat_bp = Blueprint("chat", __name__)
chat_service = ChatService()




@chat_bp.route("/ask", methods=["POST"])
@jwt_required()
@limiter.limit("20 per minute")
def ask_question():
    data = request.get_json()

    if not data:
        return jsonify({
    "success": False,
    "message": "Request body required"
}), 400

    if "question" not in data or "documentId" not in data:
        return jsonify({
    "success": False,
    "message": "Both question and documentId are required"
}), 400

    question = data["question"]
    if not isinstance(question, str) or not question.strip():
        return jsonify({
    "success": False,
    "message": "Question cannot be empty"
}), 400

    if len(question) < 3:
        return jsonify({
    "success": False,
    "message": "Question is too short"
}), 400
    
    if len(question) > 500:
        return jsonify({
    "success": False,
    "message": "Question is too long (max 500 characters)"
}), 400
        
    document_id = data["documentId"]
    user_id = request.user["userId"]

    try:
        document_object_id = ObjectId(document_id)
    except InvalidId:
        return jsonify({
    "success": False,
    "message": "Invalid documentId"
}), 400

    document = extensions.db.documents.find_one({
        "_id": document_object_id,
        "userId": ObjectId(user_id),
        "enabled": True
    })

    if not document:
        return jsonify({
    "success": False,
    "message": "Document not found or access denied"
}), 404

    try:
        result = chat_service.ask_question(
            question=question,
            user_id=user_id,
            document_id=document_id
        )
        return jsonify({
    "success": True,
    "data": result
}), 200

    except Exception as e:
        print("Chat error:", str(e))
        return jsonify({
    "success": False,
    "message": str(e)
}), 500



@chat_bp.route("/history", methods=["GET"])
@jwt_required()
@limiter.limit("60 per minute")
def chat_history():
    user_id = request.user["userId"]
    document_id = request.args.get("documentId")

    if not document_id:
        return jsonify({
        "success": False,
        "message": "documentId query param is required"
    }), 400

    try:
        document_object_id = ObjectId(document_id)
    except InvalidId:
        return jsonify({
    "success": False,
    "message": "Invalid documentId"
}), 400

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

    serialized_messages = [serialize_dict(msg) for msg in messages]

    return jsonify({
        "success": True,
         "data": {
        "messages": serialized_messages
    },
        "count": len(serialized_messages),
        "messages": serialized_messages
    }), 200