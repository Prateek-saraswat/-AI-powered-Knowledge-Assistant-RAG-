from dotenv import load_dotenv
load_dotenv()

from app.main import create_app
from app.services.document_service import DocumentService

# 🔥 CREATE APP (INITIALIZES MONGODB)
app = create_app()

# 🔥 ENTER APP CONTEXT
with app.app_context():
    service = DocumentService()
    result = service.ingest_document("uploads/documents/sample.pdf")

    print("\nRESULT:")
    print(result)
