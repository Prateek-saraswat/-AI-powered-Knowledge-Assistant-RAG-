import requests
import os
from datetime import datetime
from bson import ObjectId
import app.extensions as extensions
from app.config import Config


class EmbeddingService:
    def __init__(self):
        self.embed_model = os.getenv("OLLAMA_EMBED_MODEL")
        self.chat_model = os.getenv("OLLAMA_CHAT_MODEL")

        if not self.embed_model or not self.chat_model:
            raise RuntimeError("OLLAMA models are not configured in environment variables")

   
    def embed_text(self, text: str, user_id=None):
        try:
            response = requests.post(
                 f"{Config.OLLAMA_BASE_URL}/api/embeddings",
                json={
                    "model": self.embed_model,
                    "prompt": text
                },
                timeout=30
            )
            response.raise_for_status()
        except requests.RequestException as e:
            raise RuntimeError(f"Ollama embedding error: {str(e)}")

        data = response.json()

        if "embedding" not in data:
            raise RuntimeError(f"Invalid embedding response: {data}")

        embedding = data["embedding"]

        token_count = len(text.split())

        if user_id:
            extensions.db.usage_logs.insert_one({
                "userId": ObjectId(user_id),
                "type": "embedding",
                "tokens": token_count,
                "model": self.embed_model,
                "createdAt": datetime.utcnow()
            })

        return embedding

 
    def generate_answer(self, prompt: str, user_id=None):
        try:
            response = requests.post(
               f"{Config.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": self.chat_model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=60
            )
            response.raise_for_status()
        except requests.RequestException as e:
            raise RuntimeError(f"Ollama generation error: {str(e)}")

        data = response.json()

        answer = data.get("response")
        if answer is None:
            raise RuntimeError(f"Invalid generation response: {data}")

        token_count = len(prompt.split()) + len(answer.split())

        if user_id:
            extensions.db.usage_logs.insert_one({
                "userId": ObjectId(user_id),
                "type": "generation",
                "tokens": token_count,
                "model": self.chat_model,
                "createdAt": datetime.utcnow()
            })

        return answer
