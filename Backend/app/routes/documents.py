import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from bson import ObjectId

from app.services.document_service import DocumentService
from app.middlewares.auth_middleware import jwt_required
import app.extensions as extensions


documents_bp = Blueprint("documents", __name__)

UPLOAD_FOLDER = "uploads/documents"
ALLOWED_EXTENSIONS = {"pdf", "txt"}

document_service = DocumentService()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------
# UPLOAD DOCUMENT (USER BASED)
# ---------------------------
@documents_bp.route("/upload", methods=["POST"])
@jwt_required
def upload_document():
    print("\n📤 Upload request received")

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF and TXT allowed"}), 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # 🔐 Prevent filename collisions
    original_filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{original_filename}"

    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)

    print(f"📁 File saved at {file_path}")

    user_id = request.user["userId"]

    try:
        result = document_service.ingest_document(
            file_path=file_path,
            user_id=user_id
        )
        return jsonify(result), 201

    except Exception as e:
        print("❌ Upload error:", e)
        return jsonify({"error": str(e)}), 500


# ---------------------------
# LIST USER DOCUMENTS
# ---------------------------
@documents_bp.route("/list", methods=["GET"])
@jwt_required
def list_documents():
    user_id = request.user["userId"]

    if extensions.db is None:
        return jsonify({"error": "DB not initialized"}), 500

    documents = list(
        extensions.db.documents.find(
            {"userId": ObjectId(user_id)},
            {
                "_id": 1,
                "filename": 1,
                "status": 1,
                "enabled": 1,
                "createdAt": 1
            }
        ).sort("createdAt", -1)
    )

    # Convert ObjectId to string
    for doc in documents:
        doc["documentId"] = str(doc.pop("_id"))

    return jsonify({
        "count": len(documents),
        "documents": documents
    }), 200
