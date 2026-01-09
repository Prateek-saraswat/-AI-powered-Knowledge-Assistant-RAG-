from pypdf import PdfReader
import os


def load_text_from_file(file_path: str)-> str :

    """
    Load text from PDF or TXT file.
    """
    print(f"📄 Loading file: {file_path}")

    if not os.path.exists(file_path):
        print("❌ File does not exist")
        raise FileNotFoundError("File not found")

    elif file_path.endswith(".pdf"):
        return _load_pdf(file_path)    

    else:
        print("❌ Unsupported file format")
        raise ValueError("Only PDF and TXT files are supported")




def _load_pdf(file_path: str) -> str :
    print("📘 Detected PDF file")

    reader = PdfReader(file_path)
    text = ""


    for i, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        text += page_text
        print(f"📄 Read page {i + 1}")

    print(f"✅ PDF loaded successfully")
    print(f"📝 Extracted text length: {len(text)} characters")

    return text



def _load_txt(file_path:str) -> str:
    print("📘 Detected TXT file")

    with open(file_path, "r" , encoding="utf-8") as f:
        text = f.read()

    
    print("TXT loaded sucessfully!")
    print(f"Extracted text length: {len(text)} characters")


    return text


