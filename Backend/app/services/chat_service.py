import app.extensions as extensions
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from datetime import datetime
from bson import ObjectId


class ChatService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_service = VectorService()

    def ask_question(
        self,
        question: str,
        user_id: str,
        document_id: str,
        top_k: int = 5
    ):
        print("\nNew question received")

        if extensions.db is None:
            raise RuntimeError("MongoDB not initialized")

        print("Searching relevant chunks in Pinecone")
        results = self.vector_service.search(
            query=question,
            user_id=user_id,
            document_id=document_id,
            top_k=top_k
        )

        if not results.matches:
            answer = "No relevant information found for this document."
        else:
            chunk_texts = []

            for match in results.matches:
                vector_id = match["id"]

                chunk = extensions.db.documents_chunk.find_one(
                    {
                        "vectorId": vector_id,
                        "userId": ObjectId(user_id),
                        "documentId": ObjectId(document_id)
                    },
                    {"_id": 0}
                )

                if chunk:
                    chunk_texts.append(chunk["text"])

            if not chunk_texts:
                answer = "No relevant information found for this document."
            else:
                context = "\n\n".join(chunk_texts)

                print("Asking LLM with retrieved context")

                prompt = f"""
You are a smart, friendly AI assistant like ChatGPT.

Follow these rules carefully:

1. If the user's question is related to the provided document context
   (such as names, skills, experience, projects, explanations, time/space complexity,
   links, or any detail from the document),
   then answer STRICTLY using ONLY the document context.

2. If the question is about the document but the answer is NOT present,
   reply exactly with:
   "Not found in document"

3. If the question is NOT related to the document,
   answer normally using your general knowledge.
   This includes:
   - General awareness
   - Mathematics
   - DSA & algorithms
   - Programming concepts
   - Logical reasoning

4. If the user greets or chats casually
   (e.g. "hi", "hello", "how are you"),
   reply politely and conversationally.

5. Do NOT make up document-related facts.

6. Keep answers clear, well-structured, and easy to understand.
   Use bullet points or step-by-step explanations when helpful.

----------------------------------
Document Context:
{context}

User Question:
{question}

Answer:
"""

                answer = self.embedding_service.generate_answer(
                    prompt,
                    ObjectId(user_id)   # 🔥 TOKEN USAGE TRACKED
                )

        extensions.db.chat_messages.insert_one({
            "userId": ObjectId(user_id),
            "documentId": ObjectId(document_id),
            "question": question,
            "answer": answer,
            "createdAt": datetime.utcnow()
        })

        print("Chat saved to database")
        print("Answer generated")

        return {
            "answer": answer
        }
