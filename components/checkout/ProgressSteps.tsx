import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "cart" | "checkout" | "payment" | "done";

interface ProgressStepsProps {
  currentStep: Step;
  className?: string;
}

const steps = [
  { key: "cart" as const, label: "Cart", number: 1 },
  { key: "checkout" as const, label: "Checkout", number: 2 },
  { key: "payment" as const, label: "Payment", number: 3 },
  { key: "done" as const, label: "Done", number: 4 },
];

export function ProgressSteps({ currentStep, className }: ProgressStepsProps) {
  const getCurrentStepNumber = (step: Step) => {
    return steps.find(s => s.key === step)?.number || 1;
  };

  const currentStepNumber = getCurrentStepNumber(currentStep);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStepNumber;
          const isCurrent = step.key === currentStep;
          const isUpcoming = step.number > currentStepNumber;

          return (
            <div key={step.key} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    {
                      "bg-[#5b3a1a] border-[#5b3a1a] text-white": isCompleted || isCurrent,
                      "bg-white dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#8b7355] dark:text-[#a8956b]": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium mt-2 transition-colors",
                    {
                      "text-[#5b3a1a] dark:text-[#d4a574]": isCompleted || isCurrent,
                      "text-[#8b7355] dark:text-[#a8956b]": isUpcoming,
                    }
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 relative">
                  <div
                    className={cn(
                      "absolute inset-0 transition-colors",
                      {
                        "bg-[#5b3a1a]": step.number < currentStepNumber,
                        "bg-[#e5d5c8] dark:bg-[#3b2a1b]": step.number >= currentStepNumber,
                      }
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}