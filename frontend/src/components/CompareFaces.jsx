import React, { useEffect, useState } from "react";

const CompareFaces = ({ onBack, onFinish }) => {
  const [matchScore, setMatchScore] = useState(null);

  // Mock match score generation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMatchScore(Math.floor(Math.random() * 20) + 80); // random score between 80–99
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // These would be props or come from global state in real setup
  const idFaceImage = "/api/images/id-face"; // Replace with API endpoint or state variable
  const selfieImage = "/api/images/selfie";  // Replace with API endpoint or state variable

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Step 5: Compare Faces</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-medium mb-2">ID Face</p>
          <img
            src={idFaceImage}
            alt="ID face"
            className="w-full h-auto rounded shadow border border-gray-300"
          />
        </div>

        <div>
          <p className="font-medium mb-2">Captured Selfie</p>
          <img
            src={selfieImage}
            alt="Captured selfie"
            className="w-full h-auto rounded shadow border border-gray-300"
          />
        </div>
      </div>

      {!matchScore ? (
        <p className="text-gray-500">Analyzing facial similarity... ⏳</p>
      ) : (
        <div>
          <p className="text-xl font-semibold">
            Match Score: <span className="text-green-600">{matchScore}%</span>
          </p>
          <p className="text-sm text-gray-500">
            {matchScore >= 85 ? "✅ Faces Matched Successfully" : "❌ Faces Do Not Match"}
          </p>
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
          onClick={onFinish}
          disabled={!matchScore}
          className={`px-6 py-2 rounded ${
            matchScore
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default CompareFaces;
