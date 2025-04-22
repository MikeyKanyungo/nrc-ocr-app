import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CaptureFront = ({ onNext, onBack }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFrontImage(imageSrc);
    const base64String = imageSrc.split(",")[1]; // remove data:image/...;base64,
    sessionStorage.setItem("front_id", base64String);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFrontImage(reader.result);
      const base64String = reader.result.split(",")[1];
      sessionStorage.setItem("front_id", base64String);
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setFrontImage(null);
    sessionStorage.removeItem("front_id");
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Step 1: Capture Front of ID</h2>

      {!frontImage ? (
        <>
          {/* Upload Option */}
          <p className="mb-2 font-medium">Upload from device:</p>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="mb-4 border border-gray-300 rounded p-2 bg-gray-50"
          />

          {/* Camera Option */}
          <div className="relative inline-block">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded shadow border border-gray-300"
            />
            <button
              onClick={switchCamera}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded"
            >
              Switch
            </button>
          </div>

          <button
            onClick={capturePhoto}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 mx-auto"
          >
            <img
              className="w-5 h-5"
              src="src/assets/capture-svgrepo-com.svg"
              alt="capture"
            />
            Capture
          </button>
        </>
      ) : (
        <>
          {/* Preview */}
          <div className="mt-4">
            <p className="mb-2 font-medium">Preview:</p>
            <img
              src={frontImage}
              alt="Front of ID"
              className="max-w-full h-auto rounded border border-gray-300 shadow-sm mx-auto"
            />

            {/* Retake Button */}
            <button
              onClick={retakePhoto}
              className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Retake
            </button>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!frontImage}
          className={`px-6 py-2 rounded ${
            frontImage
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

export default CaptureFront;
