import React, { useEffect, useState } from "react";

const ExtractDetails = ({ onNext, onBack }) => {
  const [ocrData, setOcrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    extractDetailsFromID();
  }, []);

  const extractDetailsFromID = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const base64Image = localStorage.getItem("front_id_base64");
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  
      if (!base64Image) {
        throw new Error("No image found in storage");
      }
  
      const response = await fetch(`${apiBaseUrl}/api/ocr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorData || response.statusText}`);
      }
  
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      setOcrData(data);
    } catch (err) {
      console.error("OCR error:", err);
      setError(err.message || "Failed to extract details. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Step 3: Extract Details</h2>

      {loading ? (
        <div className="text-gray-600">Running OCR... Please wait ⏳</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="text-left">
          <p className="mb-2 font-medium">Extracted Details:</p>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
            {typeof ocrData === 'string' ? ocrData : JSON.stringify(ocrData, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back
        </button>

        <button
          onClick={onNext}
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