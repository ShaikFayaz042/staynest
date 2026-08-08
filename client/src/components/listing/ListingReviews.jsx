// components/ListingReviews.jsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from '../../context/ToastContext';
import ReviewCard from "./ReviewCard";


const apiUrl = import.meta.env.VITE_API_URL;

const CATEGORY_MAP = {
  cleanliness: { label: "Cleanliness", icon: "fa-spray-can-sparkles" },
  accuracy: { label: "Accuracy", icon: "fa-circle-check" },
  checkIn: { label: "Check-in", icon: "fa-key" },
  communication: { label: "Communication", icon: "fa-comment" },
  location: { label: "Location", icon: "fa-map" },
  value: { label: "Value", icon: "fa-tag" },
};

// ---------- Animated Rating with Laurel Wreath (unchanged) ----------
const LAUREL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');

.rs-rating-wrapper {
  --leaf-stop-1: #6a6a6a;
  --leaf-stop-2: #333333;
  --leaf-stop-3: #1f1f1f;
  --leaf-stop-4: #0a0a0a;
  display: flex;
  align-items: center;
  gap: 18px;
  transform-style: preserve-3d;
  perspective: 1000px;
  font-family: 'Montserrat', sans-serif;
  min-height: 140px;
}

.dark .rs-rating-wrapper {
  --leaf-stop-1: #ffffff;
  --leaf-stop-2: #d4d4d8;
  --leaf-stop-3: #a1a1aa;
  --leaf-stop-4: #71717a;
}

.rs-number-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 140px;
  transform-style: preserve-3d;
}

.rs-rating-number {
  font-size: 6.8rem;
  color: #2c2c2c;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0px 1px 0px #222, 0px 2px 0px #1a1a1a, 0px 3px 0px #151515,
    0px 4px 0px #111, 0px 5px 0px #0a0a0a, 0px 15px 20px rgba(0,0,0,0.25),
    0px 25px 35px rgba(0,0,0,0.15);
  transform: rotateX(0deg) translateZ(0);
  animation: rs-flipIn3D 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.dark .rs-rating-number {
  color: #fafafa;
  text-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 8px 18px rgba(0,0,0,0.45);
}

@keyframes rs-flipIn3D {
  0% { opacity: 0; transform: rotateX(80deg) translateZ(-100px) scale(0.8); }
  100% { opacity: 1; transform: rotateX(0deg) translateZ(0) scale(1); }
}

.rs-celebrate {
  animation: rs-wobble3D 0.8s ease-in-out forwards !important;
}

@keyframes rs-wobble3D {
  0% { transform: rotateX(0deg) rotateY(0deg) scale(1); }
  25% { transform: rotateX(15deg) rotateY(-10deg) scale(1.08); }
  50% { transform: rotateX(-10deg) rotateY(10deg) scale(1.08); }
  75% { transform: rotateX(5deg) rotateY(-5deg) scale(1.02); }
  100% { transform: rotateX(0deg) rotateY(0deg) scale(1); }
}

.rs-laurel-svg { overflow: visible; filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.2)); }

.rs-stem {
  stroke-dasharray: 250;
  stroke-dashoffset: 250;
  animation: rs-drawStem 1s ease-out forwards;
}
@keyframes rs-drawStem { to { stroke-dashoffset: 0; } }

.rs-leaf-group {
  opacity: 0;
  transform: perspective(400px) rotateY(-90deg) rotateX(-30deg) scale(0);
  transform-origin: center bottom;
  animation: rs-popLeaf3D 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes rs-popLeaf3D {
  to { opacity: 1; transform: perspective(400px) rotateY(0deg) rotateX(0deg) scale(1); }
}
.rs-leaf-1 { animation-delay: 0.1s; }
.rs-leaf-2 { animation-delay: 0.3s; }
.rs-leaf-3 { animation-delay: 0.5s; }
.rs-leaf-4 { animation-delay: 0.7s; }
.rs-leaf-5 { animation-delay: 0.9s; }

.rs-floating-emoji {
  position: absolute;
  font-size: 2.2rem;
  pointer-events: none;
  z-index: 10;
  animation: rs-floatUpAndOut 1.2s ease-out forwards;
  filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.2));
}
.dark .rs-floating-emoji {
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.12)) drop-shadow(0 6px 14px rgba(0,0,0,0.45));
}

@keyframes rs-floatUpAndOut {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3) rotate(0deg); }
  20% { opacity: 1; transform: translate(var(--dx), var(--dy-start)) scale(1.2) rotate(var(--rot)); }
  100% { opacity: 0; transform: translate(calc(var(--dx) * 1.6), var(--dy-end)) scale(0.9) rotate(calc(var(--rot) * 1.5)); }
}
`;

function Laurel({ mirror = false }) {
  const inner = (
    <>
      <path
        d="M 80,180 C 10,140 10,60 60,10"
        fill="none"
        stroke="url(#rs-leafGrad)"
        strokeWidth="4"
        className="rs-stem"
        strokeLinecap="round"
      />
      <g transform="translate(60, 160) rotate(-40) scale(1)">
        <g className="rs-leaf-group rs-leaf-1">
          <path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" />
        </g>
      </g>
      <g transform="translate(40, 130) rotate(-20) scale(1.1)">
        <g className="rs-leaf-group rs-leaf-2">
          <path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" />
        </g>
      </g>
      <g transform="translate(25, 95) rotate(5) scale(1.2)">
        <g className="rs-leaf-group rs-leaf-3">
          <path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" />
        </g>
      </g>
      <g transform="translate(25, 55) rotate(35) scale(1.1)">
        <g className="rs-leaf-group rs-leaf-4">
          <path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" />
        </g>
      </g>
      <g transform="translate(45, 20) rotate(65) scale(0.9)">
        <g className="rs-leaf-group rs-leaf-5">
          <path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" />
        </g>
      </g>
    </>
  );

  return (
    <svg className="rs-laurel-svg" width="78" height="156" viewBox="0 0 100 200">
      <defs>
        <linearGradient id="rs-leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--leaf-stop-1)" />
          <stop offset="40%" stopColor="var(--leaf-stop-2)" />
          <stop offset="80%" stopColor="var(--leaf-stop-3)" />
          <stop offset="100%" stopColor="var(--leaf-stop-4)" />
        </linearGradient>
        <filter id="rs-inner-glow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feOffset dx="-2" dy="-2" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
          <feFlood floodColor="white" floodOpacity="0.3" />
          <feComposite in2="shadowDiff" operator="in" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
      {mirror ? <g transform="translate(100, 0) scale(-1, 1)">{inner}</g> : inner}
    </svg>
  );
}

function AnimatedRating({ targetRating }) {
  const numRef = useRef(null);
  const containerRef = useRef(null);
  const [display, setDisplay] = useState("0.0");

  useEffect(() => {
    if (!targetRating) {
      setDisplay("—");
      return;
    }

    const target = targetRating;
    const duration = 2500;
    const fps = 60;
    const totalFrames = Math.round((duration / 1000) * fps);
    let frame = 0;
    let lastEmojiThreshold = 0;
    const timers = [];

    const getEmojiForRating = (val) => {
      if (val < 1.5) return ["👍", "🙂", "⭐", "👏"][Math.floor(Math.random() * 4)];
      if (val < 3.0) return ["😊", "🎉", "🌟", "✨", "❤️"][Math.floor(Math.random() * 5)];
      if (val < 4.2) return ["😍", "🔥", "💖", "🙌", "💯"][Math.floor(Math.random() * 5)];
      return ["🥳", "🔥", "🤩", "💖", "💯", "⭐"][Math.floor(Math.random() * 6)];
    };

    const spawnEmoji = (currentVal) => {
      const container = containerRef.current;
      if (!container) return;
      const emojiEl = document.createElement("div");
      emojiEl.className = "rs-floating-emoji";
      emojiEl.innerText = getEmojiForRating(currentVal);
      const randomX = (Math.random() - 0.5) * 140;
      const randomRotation = (Math.random() - 0.5) * 40;
      const dyStart = -30 - Math.random() * 20;
      const dyEnd = -120 - Math.random() * 60;
      emojiEl.style.setProperty("--dx", `${randomX}px`);
      emojiEl.style.setProperty("--dy-start", `${dyStart}px`);
      emojiEl.style.setProperty("--dy-end", `${dyEnd}px`);
      emojiEl.style.setProperty("--rot", `${randomRotation}deg`);
      emojiEl.style.left = "50%";
      emojiEl.style.top = "50%";
      container.appendChild(emojiEl);
      const t = setTimeout(() => emojiEl.remove(), 1200);
      timers.push(t);
    };

    const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentVal = target * easeOutQuart(progress);

      if (currentVal >= lastEmojiThreshold + 0.18 && currentVal <= target) {
        spawnEmoji(currentVal);
        lastEmojiThreshold = currentVal;
      }

      if (frame >= totalFrames) {
        setDisplay(target.toFixed(1));
        clearInterval(counter);
        for (let i = 0; i < 4; i++) {
          const t = setTimeout(() => spawnEmoji(target), i * 100);
          timers.push(t);
        }
        const t = setTimeout(() => {
          if (numRef.current) numRef.current.classList.add("rs-celebrate");
        }, 50);
        timers.push(t);
      } else {
        setDisplay(currentVal.toFixed(1));
      }
    }, 1000 / fps);

    return () => {
      clearInterval(counter);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [targetRating]);

  return (
    <div className="rs-rating-wrapper">
      <Laurel />
      <div className="rs-number-container" ref={containerRef}>
        <h1 className="rs-rating-number" ref={numRef}>{display}</h1>
      </div>
      <Laurel mirror />
    </div>
  );
}

// ---------- Main Component ----------
export default function ListingReviews({ listingId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  const ratingContainerRef = useRef(null);
  const [shouldAnimateRating, setShouldAnimateRating] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [categories, setCategories] = useState({
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 5,
    value: 5,
  });
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);

  // Derived stats from reviews
  const totalReviews = reviews.length;
  const overallRating = totalReviews
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
    : 0;

  const categoryAverages = Object.keys(CATEGORY_MAP).reduce((acc, key) => {
    const scores = reviews
      .map((r) => r.categories?.[key])
      .filter((score) => typeof score === "number");
    acc[key] = scores.length
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : 0;
    return acc;
  }, {});

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const val = Math.round(r.rating || 0);
    if (val >= 1 && val <= 5) ratingDistribution[val]++;
  });
  const maxCount = Math.max(...Object.values(ratingDistribution), 1);

  // Fetch reviews
  useEffect(() => {
    const controller = new AbortController();
    const fetchReviews = async () => {
      if (!listingId) {
        setReviews([]);
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/reviews?listing=${listingId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
        setReviews([]);
      }
    };
    fetchReviews();
    return () => controller.abort();
  }, [listingId]);

  // Observe rating area and trigger animation only when scrolled into view
  useEffect(() => {
    if (shouldAnimateRating) return; // already triggered
    const el = ratingContainerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e && e.isIntersecting) {
          setShouldAnimateRating(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldAnimateRating]);

  const { showToast } = useToast();

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    if (!user) {
      showToast({ message: 'Please log in to submit a review.', type: 'error' });
      return;
    }
    if (!comment.trim()) {
      showToast({ message: 'Please write a review before submitting.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing: listingId,
          rating,
          comment: comment.trim(),
          categories,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit review");

      const newReview = {
        ...data.data,
        user: {
          name: user?.name || "You",
          avatar: user?.avatar || user?.profile || "",
          joinedAt: user?.joinedAt || new Date().toISOString(),
        },
      };
      setReviews((prev) => [newReview, ...prev]);
      showToast({ message: 'Review submitted successfully.', type: 'success' });
      setComment("");
      setRating(5);
      setCategories({
        cleanliness: 5,
        accuracy: 5,
        checkIn: 5,
        communication: 5,
        location: 5,
        value: 5,
      });
      setMessage("");
    } catch (err) {
      console.error(err);
      showToast({ message: err.message || 'Unable to submit review. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const categoryList = Object.keys(CATEGORY_MAP).map((key) => ({
    key,
    label: CATEGORY_MAP[key].label,
    icon: CATEGORY_MAP[key].icon,
    value: categoryAverages[key] ? categoryAverages[key].toFixed(1) : "—",
  }));

  const visibleReviews = reviews.slice(0, visibleReviewsCount);
  const hasMoreReviews = reviews.length > 4;
  const isExpanded = visibleReviewsCount >= reviews.length && reviews.length > 4;

  return (
    <section className="border-t border-b border-gray-200 dark:border-gray-700 py-3 sm:py-4">
      <style>{LAUREL_STYLES}</style>

      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white text-center sm:text-xl">
          Reviews &amp; Ratings
        </h2>

        {/* Upper section: form + summary */}
        <div className="grid gap-3 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          {/* Left column: review form */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-center sm:text-base">
              Share your experience
            </h3>
            <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-400 text-center sm:text-xs">
              Help future guests make a decision.
            </p>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              {/* Overall rating stars (yellow) */}
              <div>
                <label className="text-[11px] font-medium text-gray-900 dark:text-gray-100 sm:text-xs">
                  Overall rating
                </label>
                <div className="mt-1.5 flex items-center justify-center gap-1 sm:gap-1.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`transition-transform duration-200 ${
                        rating >= value
                          ? "scale-110 text-yellow-400 hover:scale-125"
                          : "text-gray-300 dark:text-gray-600 hover:scale-110"
                      }`}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    >
                      <i className="fa-solid fa-star text-lg sm:text-xl" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category ratings (yellow stars) */}
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(CATEGORY_MAP).map(([key, { label }]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100">
                      <span className="text-xs">{label}</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        {categories[key]} / 5
                      </span>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setCategories((prev) => ({ ...prev, [key]: value }))
                          }
                          className={`p-1 transition-transform duration-200 ${
                            categories[key] >= value
                              ? "text-yellow-400 scale-110 hover:scale-125"
                              : "text-gray-300 hover:scale-110 dark:text-gray-600"
                          }`}
                          aria-label={`${label} ${value} star${value > 1 ? "s" : ""}`}
                        >
                          <i className="fa-solid fa-star" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor="comment">
                  Your review
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="What did you like about this stay?"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-[#E61E4D] to-[#D70466] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit review"}
              </button>

              
            </form>
          </div>

          {/* Right column: rating summary */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 flex flex-col">
            <div className="flex flex-col items-center" ref={ratingContainerRef}>
                {shouldAnimateRating ? (
                  <AnimatedRating targetRating={overallRating} />
                ) : (
                  <div className="rs-rating-wrapper">
                    <Laurel />
                    <div className="rs-number-container">
                      <h1 className="rs-rating-number">{totalReviews > 0 ? overallRating.toFixed(1) : "—"}</h1>
                    </div>
                    <Laurel mirror />
                  </div>
                )}
              <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-zinc-100 sm:text-base">
                {totalReviews > 0 ? "Guest favourite" : "No reviews yet"}
              </p>
              <p className="mt-1 text-center text-xs text-gray-600 dark:text-zinc-400 sm:text-sm">
                {totalReviews > 0
                  ? `Based on ${totalReviews} review${totalReviews > 1 ? "s" : ""}`
                  : "Be the first to leave a review"}
              </p>
              <button className="mt-1.5 text-[11px] text-gray-700 dark:text-zinc-400 underline underline-offset-4 transition hover:text-gray-900 dark:hover:text-white">
                How reviews work
              </button>
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-zinc-800">
              <div className="mb-2 text-[11px] font-semibold text-gray-900 dark:text-zinc-100 sm:text-xs">
                Rating breakdown
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percent = (ratingDistribution[star] / maxCount) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-3 text-[11px] text-gray-700 dark:text-zinc-400">
                        {star}
                      </span>
                      <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-zinc-700">
                        <div
                          className="h-full rounded-full bg-gray-900 dark:bg-zinc-100"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-200 pt-2 dark:border-zinc-800">
              {categoryList.map((c) => (
                <div
                  key={c.key}
                  className="rounded-sm border border-gray-100 bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-gray-900 dark:text-zinc-100">
                      {c.label}
                    </span>
                    <i className={`fa-solid ${c.icon} text-xs text-gray-500 dark:text-zinc-400`} />
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">
                    {c.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower section: review cards */}
        <div className="mt-3 sm:mt-4">
          {reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {visibleReviews.map((review) => (
                  <ReviewCard key={review._id || review.id} review={review} />
                ))}
              </div>

              {hasMoreReviews && (
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleReviewsCount((prev) => (prev === 4 ? reviews.length : 4))
                    }
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-gray-50 p-2 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              No reviews yet. Be the first!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}