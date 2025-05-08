import React, { useEffect, useState } from "react";

const ExtractDetails = ({ onNext, onBack }) => {
  const [ocrData, setOcrData] = useState(null);
  const [editableData, setEditableData] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);

  // 1. Retry Mechanism + Image Preview
  useEffect(() => {
    extractDetailsFromID();
    const base64Image = sessionStorage.getItem("front_id");
    if (base64Image) {
      const fullUri = base64Image.startsWith("data:image") ? base64Image : `data:image/jpeg;base64,${base64Image}`;
      setPreview(fullUri);
    }
  }, []);

  // 7. Image Compression Helper
  const compressImage = async (base64Str, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width * 0.8; 
        canvas.height = img.height * 0.8;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  // 6. Client-side Validation
  const validateImage = (base64Str) => {
    const isDataUri = /^data:image\/(jpeg|png);base64,/.test(base64Str);
    const base64content = isDataUri ? base64Str.split(',')[1] : base64Str;
    const isPureBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(base64content);
    if (!isPureBase64 && !isDataUri) throw new Error("Invalid image format");

    const estimateSize = base64content.length * 0.75;
    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (estimateSize > maxBytes) {
      throw new Error(`Image too large (max ${Math.floor(maxBytes / 1024 / 1024)} MB)`);
    }
  };

  /*
    let base64content = "";
    if (isDataUri) {
      base64content = base64Str.split(',')[1];
    } else {
      base64content = base64Str;  
    }
    const isPureBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(base64content);
    if (!isPureBase64 && !isDataUri) {
      throw new Error("Invalid image format"); 
    }
    const maxBytes = 5 * 1024 * 1024;
    const approxSize = isDataUri ? base64Str.length : Math.floor(base64Str.length * 1.37);
    if (approxSize > maxBytes) {
      throw new Error(`Image too large (max ${Math.floor(maxBytes / 1024 / 1024)} MB)`);
    }
  };
  */

  
  const extractDetailsFromID = async () => {
    setLoading(true);
    setError(null);
    setProgress(10); 
    
    try {
      // 3. Session Storage Switch
      let base64Image = sessionStorage.getItem("front_id");
      if (!base64Image) throw new Error("No image found");

      // 6. Validation
      validateImage(base64Image);

      const base64content = base64Image.includes("base64, ")
      ? base64Image 
      : `data:image/jpeg;base64,${base64Image}`; 
      setProgress(20);

      // 7. Compression (only if > 1MB)
      if (base64Image.length > 1 * 1024 * 1024) {
        setProgress(30);
        base64Image = await compressImage(base64Image);
        sessionStorage.setItem("front_id", base64Image);
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";
      setProgress(50);

      const response = await fetch(`${apiBaseUrl}/api/ocr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image,}),
      });

      setProgress(70);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json") 
        ? await response.json() 
        : await response.text();

      setProgress(90);
      setOcrData(data);
      // 4. Initialize editable data
      setEditableData(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("OCR Error:", err);
      setError(err.message || "Failed to extract details");
    } finally {
      setProgress(100);
      setTimeout(() => setLoading(false), 500);
    }
  };

  // 2. Data Parsing for Unstructured Text
  const parseUnstructuredData = (text) => {
    const patterns = {
      drivers_license: {
        name: /(?:Name|Full Name)[:]?\s*([A-Za-z ]+)/i,
        idNumber: /(?:ID|Number)[:]?\s*([A-Z0-9-]+)/i,
        dob: /(?:DOB|Date of Birth)[:]?\s*([\d\/\-]+)/i,
      },
      passport: {
        name: /^1\/([A-Z<]+)\s([A-Z]+)/i, // MRZ line 1 format
        country: /([A-Z]{3})$/i
      }
    };
    
    return {
      name: text.match(patterrns.name)?.[1] || "Not Found",
      idNumber: text.match(patterns.drivers_license.idNumber)?.[1] || "Not Found",
      dob: text.match(patterns.drivers_license.dob)?.[1] || "Not Found",
      country: text.match(patterns.passport.country)?.[1] || "Not Found",
    };
  };

  // Render Section
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Step 3: Extract Details</h2>

      {/* 1. Image Preview */}
      {preview && (
        <img 
          src={preview} 
          alt="Uploaded ID" 
          className="max-h-40 mx-auto mb-4 border rounded"
        />
      )}

      {/* 5. Progress Indicator */}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error ? (
        <div className="mb-4">
          <div className="text-red-600 mb-2">{error}</div>
          {/* 1. Retry Button */}
          <button
            onClick={extractDetailsFromID}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          >
            Retry Processing
          </button>
        </div>
      ) : ocrData ? (
        <div className="text-left">
          <p className="mb-2 font-medium">Extracted Details:</p>
          
          {/* 4. Edit Mode Toggle */}
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">
              {typeof ocrData === 'string' ? "Raw Text" : "Structured Data"}
            </span>
            <button
              onClick={() => setEditableData(prev => prev === ocrData ? 
                (typeof ocrData === 'string' ? ocrData : JSON.stringify(ocrData, null, 2)) : 
                ocrData
              )}
              className="text-xs text-blue-600 hover:underline"
            >
              {editableData === ocrData ? "Edit Mode" : "View Original"}
            </button>
          </div>

          {/* 4. Editable Textarea OR Parsed Data */}
          {editableData !== ocrData ? (
            <textarea
              value={editableData}
              onChange={(e) => setEditableData(e.target.value)}
              className="w-full h-40 p-2 border rounded font-mono text-sm"
            />
          ) : (
            <div className="space-y-4">
              <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
                {typeof ocrData === 'string' ? ocrData : JSON.stringify(ocrData, null, 2)}
              </pre>
              
              {/* 2. Parsed Data Section */}
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Parsed Fields:</h4>
                <ul className="space-y-1">
                  {Object.entries(parseUnstructuredData(
                    typeof ocrData === 'string' ? ocrData : JSON.stringify(ocrData)
                  )).map(([key, value]) => (
                    <li key={key} className="flex">
                      <span className="font-medium w-24 capitalize">{key}:</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-600">
          {loading ? "Processing..." : "No data extracted"}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={() => onNext(editableData !== ocrData ? editableData : ocrData)}
          disabled={!ocrData || loading}
          className={`px-6 py-2 rounded ${
            ocrData && !loading
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExtractDetails;