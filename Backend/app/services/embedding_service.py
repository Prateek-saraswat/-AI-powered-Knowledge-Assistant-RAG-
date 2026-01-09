import requests

#this files is converting text to embeddings (768 dimensions)

class EmbeddingService:
    def __init__(self):
        self.url = "http://localhost:11434/api/embeddings"
        self.model = "nomic-embed-text"

    def embed_text(self, text: str):
        response = requests.post(
            self.url,
            json={
                "model": self.model,
                "prompt": text
            }
        )
        response.raise_for_status()
        return response.json()["embedding"]

