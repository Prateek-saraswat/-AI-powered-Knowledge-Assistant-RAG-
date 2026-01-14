import os
from pinecone import Pinecone, ServerlessSpec
from app.services.embedding_service import EmbeddingService


class VectorService:
    def __init__(self):
        self.embedding_service = EmbeddingService()

        self.pc = Pinecone(
            api_key=os.getenv("PINECONE_API_KEY")
        )

        self.index_name = os.getenv("PINECONE_INDEX_NAME")
        self.dimension = int(os.getenv("PINECONE_DIMENSION"))

        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )

        self.index = self.pc.Index(self.index_name)

    def add_text(
        self,
        text: str,
        vector_id: str,
        metadata: dict,
        user_id: str
    ):
        embedding = self.embedding_service.embed_text(
            text,
            user_id=user_id
        )

        safe_metadata = {
            **metadata,
            "userId": str(user_id),
            "documentId": str(metadata.get("documentId"))
        }

        self.index.upsert(
            vectors=[
                {
                    "id": vector_id,
                    "values": embedding,
                    "metadata": safe_metadata
                }
            ]
        )

    def search(
        self,
        query: str,
        user_id: str,
        document_id: str,
        top_k: int = 12
    ):
        query_embedding = self.embedding_service.embed_text(
            query,
            user_id=user_id
        )

        filter_query = {
            "userId": str(user_id),
            "documentId": str(document_id)
        }

        return self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            filter=filter_query
        )
