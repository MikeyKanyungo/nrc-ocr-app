from PIL import Image
import os

def resize_image(image_path: str, output_path: str, size=(600, 400)):
    with Image.open(image_path) as img:
        img = img.resize(size)
        img.save(output_path)

def convert_to_jpeg(image_path: str, output_path: str):
    with Image.open(image_path) as img:
        rgb = img.convert('RGB')
        rgb.save(output_path, format="JPEG")
