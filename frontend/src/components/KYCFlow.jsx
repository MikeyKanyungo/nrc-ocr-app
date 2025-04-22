import React, { useState } from "react";
import CaptureFront from "./CaptureFront";
import CaptureBack from "./CaptureBack";
import ExtractDetails from "./ExtractDetails";
import CaptureFace from "./CaptureFaces";
import CompareFaces from "./CompareFaces";

const KYCFlow = () => {
  const [step, setStep] = useState(1);

  const goToNext = () => setStep(prev => prev + 1);
  const goToPrev = () => setStep(prev => prev - 1);

  return (
    <div className="p-6">
      {step === 1 && <CaptureFront onNext={goToNext} />}
      {step === 2 && <CaptureBack onNext={goToNext} onBack={goToPrev} />}
      {step === 3 && <ExtractDetails onNext={goToNext} onBack={goToPrev} />}
      {step === 4 && <CaptureFace onNext={goToNext} onBack={goToPrev} />}
      {step === 5 && <CompareFaces onBack={goToPrev} />}
    </div>
  );
};

export default KYCFlow;
