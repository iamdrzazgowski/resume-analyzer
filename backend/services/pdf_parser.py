import fitz

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Wyciąga tekst z pliku PDF podanego jako bajty."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()