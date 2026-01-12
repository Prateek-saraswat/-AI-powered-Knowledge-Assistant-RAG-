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

        #MongoDb collections
        self.documents_collection = extensions.db.documents
        self.chunks_collection = extensions.db.documents_chunk

    def ingest_document(self , file_path:str):

        """
        Full document ingestion pipeline
        """

        print('\n Starting document ingestion')

        if not os.path.exists(file_path):
            print("File not found" , file_path)
            raise FileNotFoundError("Document file does not exists")

        filename = os.path.basename(file_path)



        #1. Extract text 

        text = load_text_from_file(file_path)

        if not text.strip():
            print("No text extracted from document")
            raise ValueError("Empty document text")


        print(f"Total extracted length: {len(text)} characters")



        #2. Chunking of Extracted Text
        chunks = chunk_text(text)
        print(f"Created {len(chunks)} text chunks")


        #3.  save dacument metadata in mongoDb

        document_data = {
            "filename" : filename,
            "filePath" : file_path,
            "totalChunks" : len(chunks),
            "status" : "processed",
            "createdAt"  : datetime.utcnow()
        }


        document_result = self.documents_collection.insert_one(document_data)
        document_id = document_result.inserted_id

        print(f"Document metadata stored in MongoDB (id={document_id})")


        #4. Process each chunk

        print("Generating embedding and storing vectors")

        for index, chunk_text_data in enumerate(chunks):
            chunk_id = f"{document_id}_{index}"


            #store chunk metadata in mongodb
            chunk_record = {
                "documentId" : document_id,
                "chunkIndex": index,
                "text" : chunk_text_data,
                "vectorId" : chunk_id,
                "createdAt" : datetime.utcnow()
            }

            self.chunks_collection.insert_one(chunk_record)


            # Store embedding in pinecone
            self.vector_service.add_text(
                text = chunk_text_data,
                vector_id = chunk_id,
                metadata = {
                    "documentId": str(document_id),
                    "chunkIndex" : index,
                    "filename" : filename
                }
            )

            if(index + 1) % 5 == 0 or index == len(chunks) - 1:
                print(f"Processed {index + 1}/{len(chunks)} chunks")


        print("All chunk metadata stored in MongoDB")
        print("All vectors stored in Pinecone")
        print("Document ingestion completed sucessfully\n")


        return {
            "documentId" : str(document_id),
            "filename" : filename,
            "totalChunk"  : len(chunks),
            "status"  : "processed"
        }

