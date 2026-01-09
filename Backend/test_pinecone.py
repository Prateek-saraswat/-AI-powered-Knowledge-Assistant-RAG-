from dotenv import load_dotenv
load_dotenv()
from app.services.vector_service import VectorService

def test_pinecone():
    vector_service = VectorService()

    print("👉 Adding vector to Pinecone...")
    vector_service.add_text(
        text="MongoDB is a NoSQL database used to store flexible JSON-like documents",
        vector_id="test-doc-1",
        metadata={"source": "pinecone-test"}
    )

    print("👉 Searching vector in Pinecone...")
    results = vector_service.search("What is MongoDB?")

    print("\n✅ Pinecone Search Results:")
    print(results)

if __name__ == "__main__":
    test_pinecone()
