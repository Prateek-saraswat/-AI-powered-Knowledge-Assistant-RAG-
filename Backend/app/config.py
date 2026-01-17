import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET = os.getenv("JWT_SECRET")

    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY is not set")

    if not JWT_SECRET:
        raise RuntimeError("JWT_SECRET is not set")

    JWT_EXP_HOURS = int(os.getenv("JWT_EXP_HOURS", 24))


    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/ai_knowledge"
    )

    VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "vector_store/chroma")

    CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 500))
    CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 100))

    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    ).split(",")

    OLLAMA_BASE_URL = os.getenv(
        "OLLAMA_BASE_URL",
        "http://localhost:11434"
    )

    OLLAMA_CHAT_MODEL = os.getenv(
        "OLLAMA_CHAT_MODEL",
        "llama3.1:8b"
    )

    OLLAMA_EMBED_MODEL = os.getenv(
        "OLLAMA_EMBED_MODEL",
        "nomic-embed-text"
    )
