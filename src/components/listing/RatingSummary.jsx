import { useEffect, useRef, useState } from "react";

const CATEGORY_MAP = {
  cleanliness: { label: "Cleanliness", icon: "fa-spray-can-sparkles" },
  accuracy: { label: "Accuracy", icon: "fa-circle-check" },
  checkIn: { label: "Check-in", icon: "fa-key" },
  communication: { label: "Communication", icon: "fa-comment" },
  location: { label: "Location", icon: "fa-map" },
  value: { label: "Value", icon: "fa-tag" },
};

const LAUREL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');

/* ----- Light mode defaults (also used as fallback) ----- */
.rs-rating-wrapper {
  --leaf-stop-1: #6a6a6a;
  --leaf-stop-2: #333333;
  --leaf-stop-3: #1f1f1f;
  --leaf-stop-4: #0a0a0a;

  display: flex;
  align-items: center;
  gap: 18px;
  transform-style: preserve-3d;
  position: relative;
  perspective: 1000px;
  font-family: 'Montserrat', sans-serif;
  min-height: 140px;
}

/* ----- Dark mode overrides (platinum silver leaves) ----- */
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
  margin: 0;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  opacity: 1;
  text-shadow:
    0px 1px 0px #222,
    0px 2px 0px #1a1a1a,
    0px 3px 0px #151515,
    0px 4px 0px #111,
    0px 5px 0px #0a0a0a,
    0px 15px 20px rgba(0,0,0,0.25),
    0px 25px 35px rgba(0,0,0,0.15);
  transform: rotateX(0deg) translateZ(0);
  animation: rs-flipIn3D 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* Airbnb‑style dark mode rating number */
.dark .rs-rating-number {
  color: #fafafa;
  text-shadow:
    0 1px 0 rgba(255,255,255,0.08),
    0 8px 18px rgba(0,0,0,0.45);
}

@keyframes rs-flipIn3D {
  0% { opacity: 0; transform: rotateX(80deg) translateZ(-100px) scale(0.8); }
  100% { opacity: 1; transform: rotateX(0deg) translateZ(0) scale(1); }
}

.rs-celebrate {
  animation: rs-wobble3D 0.8s ease-in-out forwards !important;
}

@keyframes rs-wobble3D {
  0% { opacity: 1; transform: rotateX(0deg) rotateY(0deg) scale(1); }
  25% { opacity: 1; transform: rotateX(15deg) rotateY(-10deg) scale(1.08); }
  50% { opacity: 1; transform: rotateX(-10deg) rotateY(10deg) scale(1.08); }
  75% { opacity: 1; transform: rotateX(5deg) rotateY(-5deg) scale(1.02); }
  100% { opacity: 1; transform: rotateX(0deg) rotateY(0deg) scale(1); }
}

.rs-laurel-svg {
  overflow: visible;
  filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.2));
}

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

/* Dark mode emoji glow (softer) */
.dark .rs-floating-emoji {
  filter:
    drop-shadow(0 0 10px rgba(255,255,255,0.12))
    drop-shadow(0 6px 14px rgba(0,0,0,0.45));
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
        {/* Use CSS variables for the gradient stops – this enables dark mode switching */}
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

export default function RatingSummary({ reviewIds = [] }) {
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [categoryAverages, setCategoryAverages] = useState({});
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const listingReviews = allReviews.filter(r => reviewIds.includes(r.id));
    setReviews(listingReviews);
    if (listingReviews.length === 0) return;

    const totalRating = listingReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avg = listingReviews.length ? totalRating / listingReviews.length : 0;
    setOverallRating(Math.round(avg * 10) / 10);

    const catSums = {};
    const catCounts = {};
    listingReviews.forEach(r => {
      if (r.categories) {
        Object.entries(r.categories).forEach(([key, val]) => {
          if (CATEGORY_MAP[key]) {
            catSums[key] = (catSums[key] || 0) + val;
            catCounts[key] = (catCounts[key] || 0) + 1;
          }
        });
      }
    });
    const catAvgs = {};
    Object.keys(catSums).forEach(key => {
      catAvgs[key] = (catSums[key] / catCounts[key]).toFixed(1);
    });
    setCategoryAverages(catAvgs);

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    listingReviews.forEach(r => {
      const rating = Math.round(r.rating || 0);
      if (rating >= 1 && rating <= 5) dist[rating] = (dist[rating] || 0) + 1;
    });
    setRatingDistribution(dist);
  }, [reviewIds]);

  const categories = Object.keys(CATEGORY_MAP).map(key => ({
    label: CATEGORY_MAP[key].label,
    value: categoryAverages[key] || "—",
    icon: CATEGORY_MAP[key].icon,
  }));

  const maxCount = Math.max(...Object.values(ratingDistribution), 1);
  const bars = [5, 4, 3, 2, 1].map(star => ({
    star,
    percent: (ratingDistribution[star] / maxCount) * 100,
  }));

  return (
    <section className="border-b border-gray-200 dark:border-zinc-800 py-8">
      <style>{LAUREL_STYLES}</style>

      {/* Rating Animation – wrapped in a premium glass card */}
      <div className="mx-auto w-full max-w-2xl lg:max-w-full rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-6">
        <div className="mb-4 flex flex-col items-center">
          <AnimatedRating targetRating={overallRating} />
          <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-zinc-100">
            {reviews.length > 0 ? "Guest favourite" : "No reviews yet"}
          </p>
          <p className="mt-1 max-w-sm text-center text-sm text-gray-600 dark:text-zinc-400">
            {reviews.length > 0
              ? `Based on ${reviews.length} review${reviews.length > 1 ? "s" : ""}`
              : "Be the first to leave a review"}
          </p>
          <button className="mt-2 text-xs text-gray-700 dark:text-zinc-400 underline underline-offset-4 transition hover:text-gray-900 dark:hover:text-white">
            How reviews work
          </button>
        </div>

        {/* Progress Bars & Categories */}
        <div className="grid grid-cols-1 gap-4 border-t border-gray-200 dark:border-zinc-800 pt-6 text-sm md:grid-cols-7">
          <div>
            <div className="mb-2 text-xs font-semibold text-gray-900 dark:text-zinc-100">Overall rating</div>
            <div className="space-y-3">
              {bars.map((b) => (
                <div key={b.star} className="flex items-center gap-2">
                  <span className="w-3 text-xs text-gray-700 dark:text-zinc-400">{b.star}</span>
                  <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-zinc-700">
                    <div
                      className="h-full rounded-full bg-gray-900 dark:bg-zinc-100"
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {categories.map((c) => (
            <div key={c.label} className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 p-4 md:border-none md:bg-transparent md:p-0 md:pl-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-gray-900 dark:text-zinc-100">{c.label}</div>
                <i className={`fa-solid ${c.icon} text-lg text-gray-500 dark:text-zinc-400`} />
              </div>
              <div className="mt-3 text-lg font-semibold text-gray-900 dark:text-zinc-100">{c.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}