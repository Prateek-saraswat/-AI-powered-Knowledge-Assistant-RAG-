import os
from datetime import datetime
from bson import ObjectId

import app.extensions as extensions
from app.utils.file_loader import load_text_from_file
from app.utils.text_chunker import chunk_text
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService


class DocumentService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_service = VectorService()

        # MongoDB collections
        self.documents_collection = extensions.db.documents
        self.chunks_collection = extensions.db.documents_chunk

    def ingest_document(self, file_path: str, user_id: str):
        """
        Full document ingestion pipeline (USER-SCOPED)
        """
        print("\n📄 Starting document ingestion")

        if not os.path.exists(file_path):
            raise FileNotFoundError("Document file does not exist")

        filename = os.path.basename(file_path)

        # 1️⃣ Extract text
        text = load_text_from_file(file_path)
        if not text.strip():
            raise ValueError("Empty document text")

        print(f"📝 Extracted text length: {len(text)} characters")

        # 2️⃣ Chunk text
        chunks = chunk_text(text)
        print(f"✂️ Created {len(chunks)} chunks")

        # 3️⃣ Store document metadata (USER BASED)
        document_data = {
            "userId": ObjectId(user_id),
            "filename": filename,
            "filePath": file_path,
            "totalChunks": len(chunks),
            "status": "processed",
            "enabled": True,
            "createdAt": datetime.utcnow()
        }

        document_result = self.documents_collection.insert_one(document_data)
        document_id = document_result.inserted_id

        print(f"📦 Document saved (id={document_id})")

        # 4️⃣ Process chunks
        for index, chunk_text_data in enumerate(chunks):
            chunk_id = f"{document_id}_{index}"

            # Save chunk metadata in MongoDB
            self.chunks_collection.insert_one({
                "userId": ObjectId(user_id),
                "documentId": document_id,
                "chunkIndex": index,
                "text": chunk_text_data,
                "vectorId": chunk_id,
                "createdAt": datetime.utcnow()
            })

            # 🔥 Save vector in Pinecone (USER + DOCUMENT SAFE)
            self.vector_service.add_text(
                text=chunk_text_data,
                vector_id=chunk_id,
                user_id=user_id,
                metadata={
                    "documentId": str(document_id),
                    "chunkIndex": index,
                    "filename": filename
                }
            )

            if (index + 1) % 5 == 0 or index == len(chunks) - 1:
                print(f"✅ Processed {index + 1}/{len(chunks)} chunks")

        print("🎉 Document ingestion completed\n")

        return {
            "documentId": str(document_id),
            "filename": filename,
            "totalChunks": len(chunks),
            "status": "processed"
        }
