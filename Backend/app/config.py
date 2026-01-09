import os

class Config:

    #flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ai_knowledge")

    # Vector DB
    VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "vector_store/chroma")

    # Chunking
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 100