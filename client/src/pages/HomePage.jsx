import { useEffect, useRef, useState } from "react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import FilterBar, { defaultFilters } from "../components/home/FilterBar";
import ListingGrid from "../components/home/ListingGrid";

const introVideo = "/videos/intro.mp4";

export default function HomePage() {
  const [showIntroOverlay, setShowIntroOverlay] = useState(false);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const hasSeenIntro = window.localStorage.getItem("intro_video_seen") === "true";
    if (!hasSeenIntro) {
      setShowIntroOverlay(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = showIntroOverlay ? "hidden" : "";
    document.documentElement.style.overflow = showIntroOverlay ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showIntroOverlay]);

  useEffect(() => {
    if (showIntroOverlay && videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [showIntroOverlay, isMuted]);

  const dismissIntro = () => {
    window.localStorage.setItem("intro_video_seen", "true");
    setShowIntroOverlay(false);
  };

  const enableSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-10 bg-white dark:bg-gray-900 overflow-x-hidden">
      {showIntroOverlay && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm overflow-hidden">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl">
            <video
              ref={videoRef}
              src={introVideo}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={dismissIntro}
              className="h-auto max-h-[80vh] w-full object-contain"
            />
            <button
              onClick={dismissIntro}
              className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              Skip
            </button>
            {isMuted && (
              <button
                onClick={enableSound}
                className="absolute left-4 top-4 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white"
              >
                Click to play with sound
              </button>
            )}
          </div>
        </div>
      )}

      <Navbar type="hosting" />
      <FilterBar onFiltersChange={setActiveFilters} />
      <ListingGrid filters={activeFilters} />
      <Footer />
    </div>
  );
}