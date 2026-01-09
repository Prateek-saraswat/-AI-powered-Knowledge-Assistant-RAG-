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

        # Create index if not exists
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

    def add_text(self, text, vector_id, metadata=None):
        embedding = self.embedding_service.embed_text(text)

        self.index.upsert(
            vectors=[
                {
                    "id": vector_id,
                    "values": embedding,
                    "metadata": metadata or {}
                }
            ]
        )

    def search(self, query, top_k=3):
        query_embedding = self.embedding_service.embed_text(query)

        return self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
