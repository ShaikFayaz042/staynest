import { useState, useEffect } from "react";
import { HostNavContext } from "../components/host/HostNavContext";
import HostLanding from "../components/host/HostLanding";
import SetupIntro from "../components/host/SetupIntro";
import AddressModal from "../components/host/AddressModal";
import StepIntro from "../components/host/StepIntro";
import PropertyTypeStep from "../components/host/PropertyTypeStep";
import MapPinStep from "../components/host/MapPinStep";
import BasicsStep from "../components/host/BasicsStep";
import AmenitiesStep from "../components/host/AmenitiesStep";
import PhotosStep from "../components/host/PhotosStep";
import UploadModal from "../components/host/UploadModal";
import TitleDescriptionStep from "../components/host/TitleDescriptionStep";
import PricingStep from "../components/host/PricingStep";
import ListingsDashboard from "./ListingsDashboard";

// Phase boundaries in the step list (inclusive start, inclusive end)
const PHASES = [
  { start: 3, end: 6 },   // Phase 1
  { start: 7, end: 11 },  // Phase 2
  { start: 12, end: 14 }, // Phase 3
];

function computeProgress(index) {
  return PHASES.map(({ start, end }) => {
    if (index <= start) return 0;
    if (index >= end) return 1;
    return (index - start) / (end - start);
  });
}

export default function HostPage() {
  const [index, setIndex] = useState(0);

  const steps = [
    <HostLanding />,
    <SetupIntro />,
    <AddressModal />,
    <StepIntro
      step={1}
      title="Tell us about your place"
      description="In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room."
      image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900"
    />,
    <PropertyTypeStep />,
    <MapPinStep />,
    <BasicsStep />,
    <StepIntro
      step={2}
      title="Make your place stand out"
      description="In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then you'll create a title and description."
      image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900"
    />,
    <AmenitiesStep />,
    <PhotosStep />,
    <UploadModal />,
    <TitleDescriptionStep />,
    <StepIntro
      step={3}
      title="Finish up and publish"
      description="Finally, you'll choose booking settings, set up pricing and publish your listing."
      image="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=900"
    />,
    <PricingStep />,
    <ListingsDashboard />,
  ];

  const total = steps.length;
  const onNext = () => setIndex((i) => Math.min(i + 1, total - 1));
  const onBack = () => setIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index]);

  const progress = computeProgress(index);
  const isLast = index === total - 1;

  return (
    <HostNavContext.Provider value={{ onNext, onBack, inWizard: true, index, total }}>
      <div className="relative overflow-hidden w-full pb-24" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / total)}%)`,
            width: `${total * 100}%`,
          }}
        >
          {steps.map((step, i) => (
            <div key={i} style={{ width: `${100 / total}%` }} className="shrink-0">
              {step}
            </div>
          ))}
        </div>

        {/* Unified sticky wizard footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-3 gap-2">
            {progress.map((p, i) => (
              <div key={i} className="h-1 bg-gray-200 relative overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${p * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-8 md:px-16 py-4">
            <button
              onClick={onBack}
              disabled={index === 0}
              className={`text-sm font-semibold underline ${
                index === 0 ? "text-gray-300 cursor-not-allowed no-underline" : "text-gray-900"
              }`}
            >
              Back
            </button>
            <div className="text-xs text-gray-500">
              Step {index + 1} of {total}
            </div>
            <button
              onClick={onNext}
              disabled={isLast}
              className={`px-6 py-3 rounded-lg text-sm font-semibold ${
                isLast
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {isLast ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </HostNavContext.Provider>
  );
}
