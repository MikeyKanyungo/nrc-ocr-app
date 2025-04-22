from deepface import DeepFace

def compare_faces(id_image_path, selfie_path):
    try:
        result = DeepFace.verify(img1_path=id_image_path, img2_path=selfie_path, enforce_detection=True)
        return {
            "match": result["verified"],
            "confidence": round((1 - result["distance"]) * 100, 2)
        }
    except Exception as e:
        return {
            "match": False,
            "confidence": 0,
            "error": str(e)
        }
    
