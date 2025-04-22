import React, { useState } from "react";
import KYCFlow from "../components/KYCFlow";

const Home = () => {
  const [showCapture, setShowCapture] = useState(false);

  const handleStartCapture = () => {
    setShowCapture(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6  flex flex-col items-center justify-center">
        <div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <img class="size-12 shrink-0" src="src/assets/face-id-svgrepo-com.svg" alt="Face Logo" />
        <div>

        <div class="text-xl font-medium text-black dark:text-white">Digital ID System</div>
            <p class="text-gray-500 dark:text-gray-400"> Your ID, Everywhere! </p>
        </div>
    </div>

      {!showCapture ? (
        <button
          onClick={handleStartCapture}
          className="px-6 py-3 bg-green-600 m-4 text-white rounded-lg hover:bg-green-700 shadow-lg transition-all"
        >
          Start Capture
        </button>
      ) : (
        <KYCFlow />
      )}
    </div>
  );
};

export default Home;