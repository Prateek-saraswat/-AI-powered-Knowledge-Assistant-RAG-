import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    JWT_SECRET = os.getenv("JWT_SECRET", "jwt-dev-secret-key")
    JWT_EXP_HOURS = 24


    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/ai_knowledge"
    )

    VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "vector_store/chroma")

    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 100
