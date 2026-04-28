import fitz

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            text = "".join(page.get_text() for page in doc)
        return text.strip()
    except Exception as e:
        print(f"PDF parse error: {e}")
        return ""