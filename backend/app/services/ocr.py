import pytesseract
from PIL import Image
import base64
import io
import re
from PIL import ImageFilter, ImageOps

# Setting the tesseract_cmd to the path of the Tesseract-OCR executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def clean_text(raw_text):
    # Remove any non-ASCII characters and extra spaces
    text = raw_text.encode('ascii', errors='ignore').decode('ascii')
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

async def extract_text_from_base64(base64_string: str):
    try:
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        #image = ImageOps.grayscale(image)
        #image = ImageOps.autocontrast(image)
        #image = image.filter(ImageFilter.SHARPEN)
        text = pytesseract.image_to_string(image, config='--psm 11')
        cleaned = clean_text(text)
        return {
            "extracted_text": cleaned
        }

    except Exception as e:
        return {
            "error": str(e)
        }