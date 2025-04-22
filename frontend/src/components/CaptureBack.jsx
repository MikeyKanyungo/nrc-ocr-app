import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CaptureBack = ({ onNext, onBack }) => {
  const [backImage, setBackImage] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: facingMode,
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setBackImage(imageSrc);
    const base64String = imageSrc.split(",")[1]; // remove data:image/...;base64,
    sessionStorage.setItem("back_id_base64", base64String);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackImage(reader.result);
      const base64String = reader.result.split(",")[1];
      sessionStorage.setItem("back_id_base64", base64String);
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setBackImage(null);
    sessionStorage.removeItem("back_id_base64");
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Step 2: Capture Back of ID</h2>

      {!backImage ? (
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
              src={backImage}
              alt="Back of ID"
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
          disabled={!backImage}
          className={`px-6 py-2 rounded ${
            backImage
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

export default CaptureBack;
