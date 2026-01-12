import app.extensions as extensions
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from datetime import datetime


class ChatService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_service = VectorService()

    def ask_question(self, question: str, user_id: str, top_k: int = 5):
        print("\n🤖 New question received")

        if extensions.db is None:
            raise RuntimeError("MongoDB not initialized")

        # 1️⃣ Search similar chunks in Pinecone
        print("🔍 Searching relevant chunks in Pinecone")
        results = self.vector_service.search(question, top_k=top_k)

        if not results.matches:
            answer = "No relevant information found."
            sources = []
        else:
            # 2️⃣ Fetch chunk text from MongoDB
            chunk_texts = []
            sources = []

            for match in results.matches:
                vector_id = match["id"]

                chunk = extensions.db.document_chunks.find_one(
                    {"vectorId": vector_id},
                    {"_id": 0}
                )

                if chunk:
                    chunk_texts.append(chunk["text"])
                    sources.append({
                        "documentId": str(chunk["documentId"]),
                        "chunkIndex": chunk["chunkIndex"]
                    })

            # 3️⃣ Build context
            context = "\n\n".join(chunk_texts)

            # 4️⃣ Ask LLM
            print("🗣️ Asking LLM with retrieved context")

            prompt = f"""
You are a helpful AI assistant.
Answer the question using ONLY the context below.

Context:
{context}

Question:
{question}

Answer clearly and concisely.
"""
            answer = self.embedding_service.generate_answer(prompt)

        # 5️⃣ SAVE CHAT HISTORY (USER-SPECIFIC)
        extensions.db.chat_messages.insert_one({
            "userId": user_id,
            "question": question,
            "answer": answer,
            "sources": sources,
            "createdAt": datetime.utcnow()
        })

        print("💾 Chat saved to database")
        print("✅ Answer generated")

        return {
            "answer": answer,
            "sources": sources
        }
