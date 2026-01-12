import json
import os 

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from app.services.document_service import DocumentService
import app.extensions as extensions


documents_bp = Blueprint("documents", __name__)


UPLOAD_FOLDER = "uploads/documents"
ALLOWED_EXTENSIONS = {"pdf" , "txt" }

document_service = DocumentService()

def allowed_file(filename):
    return "." in filename and filename.rsplit("." , 1)[1].lower() in ALLOWED_EXTENSIONS


@documents_bp.route("/upload" , methods = ["POST"])
def upload_document():
    print("\n upload request recieved")



    if "file" not in request.files:
        return jsonify({"error": "No file provided"}) , 400


    file = request.files["file"]

    if file.filename == "":
        return jsonify ({"error" : "Empty filename"}) ,400


    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF and TXT allowed"}), 400


    os.makedirs(UPLOAD_FOLDER, exist_ok=True)


    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    print(f"File saved at {file_path}")


    try:
        result = document_service.ingest_document(file_path)
        return jsonify(result) , 201

    except Exception as e:
        print("Error", e)
        return jsonify({"error": str(e)}), 500



@documents_bp.route('/list' , methods=["GET"])
def list_document():
    if extensions.db is None:
        return jsonify({"error": "DB not initialized"}), 500

    

    documents = list(
        extensions.db.documents.find({} , {"_id":0})
    )


    return jsonify({
        "count": len(documents),
        "documents": documents
    }), 200


