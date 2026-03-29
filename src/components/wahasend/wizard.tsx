"use client";

import { useWizard } from "@/lib/wahasend/wizard-context";
import Stepper from "./stepper";
import StepUpload from "./step-upload";
import StepMapping from "./step-mapping";
import StepMessage from "./step-message";
import StepAuth from "./step-auth";
import StepSending from "./step-sending";
import StepReport from "./step-report";

export default function Wizard() {
  const { state } = useWizard();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <StepUpload />;
      case 2:
        return <StepMapping />;
      case 3:
        return <StepMessage />;
      case 4:
        return <StepAuth />;
      case 5:
        return <StepSending />;
      case 6:
        return <StepReport />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Stepper currentStep={state.currentStep} sendMode={state.sendMode} />
      <div className="bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8">
        {renderStep()}
      </div>
    </div>
  );
}
