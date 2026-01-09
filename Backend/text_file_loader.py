from app.utils.file_loader import load_text_from_file

# Put a sample PDF in this path
file_path = "uploads/documents/sample.pdf"

text = load_text_from_file(file_path)

print("\n--- TEXT PREVIEW ---")
print(text[:500])