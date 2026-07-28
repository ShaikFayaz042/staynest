import { useEffect, useRef, useState } from "react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import CategoryBar from "../components/home/CategoryBar";
import ListingGrid from "../components/home/ListingGrid";
import introVideo from "../assets/videos/intro.mp4";

export default function HomePage() {
  const [showIntroOverlay, setShowIntroOverlay] = useState(false);
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
      videoRef.current.play().catch(() => {});
    }
  }, [showIntroOverlay]);

  const dismissIntro = () => {
    window.localStorage.setItem("intro_video_seen", "true");
    setShowIntroOverlay(false);
  };

  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-10 bg-white dark:bg-gray-900 overflow-hidden">
      {showIntroOverlay && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm overflow-hidden">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl">
            <video
              ref={videoRef}
              src={introVideo}
              autoPlay
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
          </div>
        </div>
      )}

      <Navbar type="hosting" />
      <CategoryBar />
      <ListingGrid />
      <Footer />
    </div>
  );
}