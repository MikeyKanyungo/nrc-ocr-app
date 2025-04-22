import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const IDCapture = () => {
  const webcamRef = useRef(null);
  const [idImage, setIdImage] = useState(null);
  const [liveImage, setLiveImage] = useState(null);

  const captureLiveImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setLiveImage(imageSrc);
  };

  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setIdImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    console.log("Sending to backend...", {
      idImage,
      liveImage,
    });
    // To-do: connect to backend API
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold">Zambian ID KYC Capture</h2>

      {/* Upload ID */}
      <div>
        <label className="block font-medium mb-2">Upload National ID</label>
        <input type="file" accept="image/*" onChange={handleIdUpload} />
        {idImage && <img src={idImage} alt="ID" className="mt-2 w-64 rounded shadow" />}
      </div>

      {/* Webcam Live */}
      <div>
        <label className="block font-medium mb-2">Capture Live Face Image</label>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded"
          width={300}
          videoConstraints={{ facingMode: "user" }}
        />
        <button
          onClick={captureLiveImage}
          className="mt-2 px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Capture
        </button>

        {liveImage && <img src={liveImage} alt="Live" className="mt-2 w-64 rounded shadow" />}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
      >
        Submit to Backend
      </button>
    </div>
  );
};

export default IDCapture;
