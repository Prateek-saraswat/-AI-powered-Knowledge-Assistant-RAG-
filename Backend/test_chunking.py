from app.utils.text_chunker import chunk_text

text = (
    "MongoDB is a NoSQL database designed for scalability and flexibility. "
    "It stores data in JSON-like documents and is widely used in modern applications. "
    "Pinecone is a vector database used for semantic search."
)

chunks = chunk_text(text, chunk_size=50, chunk_overlap=10)

for i, c in enumerate(chunks):
    print(f"Chunk {i+1}: {c}\n")
