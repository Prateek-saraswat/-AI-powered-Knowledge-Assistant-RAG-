import requests
import os


class EmbeddingService:
    def __init__(self):
        self.embed_model = os.getenv("OLLAMA_EMBED_MODEL")
        self.chat_model = os.getenv("OLLAMA_CHAT_MODEL", "llama3")

    def embed_text(self, text: str):
        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={
                "model": self.embed_model,
                "prompt": text
            }
        )
        return response.json()["embedding"]

    def generate_answer(self, prompt: str):
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": self.chat_model,
                "prompt": prompt,
                "stream": False
            }
        )

        data = response.json()

        # Handle different Ollama response formats safely
        if "response" in data:
            return data["response"]

        if "message" in data and "content" in data["message"]:
            return data["message"]["content"]

        if "error" in data:
            raise RuntimeError(data["error"])

        # Fallback (debug)
        raise RuntimeError(f"Unexpected Ollama response: {data}")
