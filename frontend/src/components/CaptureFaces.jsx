import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: "user",
};

const CaptureFace = ({ onNext, onBack }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Step 4: Capture Selfie</h2>

      {!capturedImage ? (
        <div className="flex flex-col items-center space-y-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded shadow border border-gray-300"
          />
          <button
            onClick={capturePhoto}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Capture Selfie
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2 font-medium">Captured Image:</p>
          <img
            src={capturedImage}
            alt="Captured face"
            className="mx-auto rounded border border-gray-300 shadow-sm"
          />
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
          disabled={!capturedImage}
          className={`px-6 py-2 rounded ${
            capturedImage
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

export default CaptureFace;
