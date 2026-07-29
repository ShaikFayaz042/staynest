import { useRef, useEffect } from "react";
import HostFrame from "./HostFrame";
import houseAnimation from "../../assets/videos/HouseAnimation.mp4";

export default function StepIntro({
  step = 1,
  title = "Tell us about your place",
  description = "In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.",
}) {
  const videoRef = useRef(null);
  
  const START_TIME = 2;
  const END_TIME = 9;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 1. Create the observer to watch when this component becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When it slides INTO view: reset the time and play
            videoElement.currentTime = START_TIME;
            videoElement.play();
          } else {
            // When it slides OUT of view: pause it so it's ready for next time
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 50% of the video is visible
    );

    // 2. Start observing the video element
    observer.observe(videoElement);

    // 3. Cleanup the observer when the component unmounts
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []); // Run once on mount

  // Check the time constantly as the video plays to stop it at END_TIME
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= END_TIME) {
      videoRef.current.pause();
      videoRef.current.currentTime = END_TIME; 
    }
  };

  return (
    <HostFrame progress={[step >= 1 ? 1 : 0, step >= 2 ? 1 : 0, step >= 3 ? 1 : 0]}>
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-8 md:py-20 grid md:grid-cols-2 gap-6 md:gap-16 items-center">
        <div>
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Step {step}</div>
          <h1 className="mt-2 md:mt-3 text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">{title}</h1>
          <p className="mt-4 md:mt-6 text-gray-600 dark:text-gray-300 text-lg">{description}</p>
        </div>
        
        <video
          ref={videoRef}
          src={houseAnimation}
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate} 
          className="rounded-3xl w-full aspect-square object-cover"
          // Note: Removed autoPlay since the IntersectionObserver handles playback now
        />
      </div>
    </HostFrame>
  );
}