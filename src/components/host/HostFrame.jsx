import { useContext } from "react";
import StayNestLogo from "../../assets/logos/StayNestLogo";
import { HostNavContext } from "./HostNavContext";

export default function HostFrame({
  children,
  progress = [1, 0, 0],
  showNext = true,
  nextDisabled = false,
  nextLabel = "Next",
  showGetStarted = false,
  hideFooter = false,
}) {
  const { onNext, onBack, inWizard } = useContext(HostNavContext);
  const suppressFooter = hideFooter || inWizard;

  // When inside wizard, use full height (h-full) not screen height
  const heightClass = inWizard ? "h-full" : "h-screen";

  return (
    <div
      className={`${heightClass} bg-white flex flex-col overflow-hidden`}
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header – fixed height, no scroll */}
      <header className="shrink-0 flex items-center justify-between px-8 md:px-16 py-4 border-b border-gray-100">
        <div className="w-10 h-10">
          <StayNestLogo theme="light" width={40} height={40} />
        </div>
        {showGetStarted ? (
          <button
            onClick={onNext || undefined}
            className="px-5 py-2.5 rounded-full text-white text-sm font-semibold"
            style={{ background: "linear-gradient(90deg,#FF385C,#E61E4D)" }}
          >
            Get started
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50">
              Questions?
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50">
              Save & exit
            </button>
          </div>
        )}
      </header>

      {/* Body – takes remaining space, scrolls internally if needed */}
      <main className="flex-1 overflow-y-auto mb-20">{children}</main>

      {/* Footer – fixed height, no scroll */}
      {!suppressFooter && (
        <footer className="shrink-0 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 px-0">
            {progress.map((p, i) => (
              <div key={i} className="h-1 bg-gray-200 relative overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{ width: `${Math.max(0, Math.min(1, p)) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-8 md:px-16 py-4">
            <button
              onClick={onBack || undefined}
              className="text-sm font-semibold underline"
            >
              Back
            </button>
            {showNext && (
              <button
                disabled={nextDisabled}
                onClick={onNext || undefined}
                className={`px-6 py-3 rounded-lg text-sm font-semibold ${
                  nextDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900"
                }`}
              >
                {nextLabel}
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}