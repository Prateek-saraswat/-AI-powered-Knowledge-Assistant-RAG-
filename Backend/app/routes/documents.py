import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from bson import ObjectId

from app.services.document_service import DocumentService
from app.middlewares.auth_middleware import jwt_required
import app.extensions as extensions
from app.extensions import limiter
from app.utils.serializer import serialize_dict


documents_bp = Blueprint("documents", __name__)

UPLOAD_FOLDER = "uploads/documents"
ALLOWED_EXTENSIONS = {"pdf", "txt"}

document_service = DocumentService()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS



@documents_bp.route("/upload", methods=["POST"])
@jwt_required()
@limiter.limit("2 per minute")
def upload_document():
    print("\nUpload request received")
    file_path = None

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    MAX_FILE_SIZE = 5 * 1024 * 1024

    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > MAX_FILE_SIZE:
        return jsonify({"error": "File size exceeds 5MB limit"}), 413
    

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF and TXT allowed"}), 400

    allowed_mimetypes = {
    "application/pdf",
    "text/plain"
}   
    if file.mimetype not in allowed_mimetypes:
        return jsonify({"error": "Invalid file type"}), 400

    file.seek(0, os.SEEK_END)
    if file.tell() == 0:
        return jsonify({"error": "Uploaded file is empty"}), 400
    file.seek(0)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    original_filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{original_filename}"

    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)

    print(f"File saved at {file_path}")

    user_id = request.user["userId"]

    try:
        result = document_service.ingest_document(
            file_path=file_path,
            user_id=user_id
        )
        return jsonify(result), 201

    except Exception as e:
        print("Upload error:", e)
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"Cleaned up failed upload: {file_path}")
            except Exception as cleanup_error:
                print("File cleanup failed:", cleanup_error)
        return jsonify({"error": str(e)}), 500



@documents_bp.route("/list", methods=["GET"])
@jwt_required()
@limiter.limit("30 per minute")
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

    documents = [serialize_dict(doc) for doc in documents]

    for doc in documents:
        doc["documentId"] = doc.pop("_id")

    return jsonify({
        "count": len(documents),
        "documents": documents
    }), 200
