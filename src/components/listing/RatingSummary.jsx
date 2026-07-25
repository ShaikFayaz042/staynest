import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  { label: "Cleanliness", value: "4.9", icon: "fa-spray-can-sparkles" },
  { label: "Accuracy", value: "5.0", icon: "fa-circle-check" },
  { label: "Check-in", value: "5.0", icon: "fa-key" },
  { label: "Communication", value: "5.0", icon: "fa-comment" },
  { label: "Location", value: "4.9", icon: "fa-map" },
  { label: "Value", value: "4.9", icon: "fa-tag" },
];

const BARS = [
  { star: 5, w: "w-full" },
  { star: 4, w: "w-2/3" },
  { star: 3, w: "w-1/6" },
  { star: 2, w: "w-1/12" },
  { star: 1, w: "w-1/12" },
];

const LAUREL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');

.rs-rating-wrapper {
  display: flex;
  align-items: center;
  gap: 18px;
  transform-style: preserve-3d;
  position: relative;
  perspective: 1000px;
  font-family: 'Montserrat', sans-serif;
  min-height: 140px;
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
@keyframes rs-floatUpAndOut {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3) rotate(0deg); }
  20% { opacity: 1; transform: translate(var(--dx), var(--dy-start)) scale(1.2) rotate(var(--rot)); }
  100% { opacity: 0; transform: translate(calc(var(--dx) * 1.6), var(--dy-end)) scale(0.9) rotate(calc(var(--rot) * 1.5)); }
}
`;

function Laurel({ mirror = false }) {
  const inner = (
    <>
      <path d="M 80,180 C 10,140 10,60 60,10" fill="none" stroke="url(#rs-leafGrad)" strokeWidth="4" className="rs-stem" strokeLinecap="round" />
      <g transform="translate(60, 160) rotate(-40) scale(1)">
        <g className="rs-leaf-group rs-leaf-1"><path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" /></g>
      </g>
      <g transform="translate(40, 130) rotate(-20) scale(1.1)">
        <g className="rs-leaf-group rs-leaf-2"><path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" /></g>
      </g>
      <g transform="translate(25, 95) rotate(5) scale(1.2)">
        <g className="rs-leaf-group rs-leaf-3"><path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" /></g>
      </g>
      <g transform="translate(25, 55) rotate(35) scale(1.1)">
        <g className="rs-leaf-group rs-leaf-4"><path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" /></g>
      </g>
      <g transform="translate(45, 20) rotate(65) scale(0.9)">
        <g className="rs-leaf-group rs-leaf-5"><path fill="url(#rs-leafGrad)" filter="url(#rs-inner-glow)" d="M0,0 C-20,-10 -30,-30 0,-50 C20,-30 10,-10 0,0 Z" /></g>
      </g>
    </>
  );

  return (
    <svg className="rs-laurel-svg" width="78" height="156" viewBox="0 0 100 200">
      <defs>
        <linearGradient id="rs-leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6a6a6a" />
          <stop offset="40%" stopColor="#333333" />
          <stop offset="80%" stopColor="#1f1f1f" />
          <stop offset="100%" stopColor="#0a0a0a" />
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

function AnimatedRating() {
  const numRef = useRef(null);
  const containerRef = useRef(null);
  const [display, setDisplay] = useState("0.0");

  useEffect(() => {
    const target = 5.0;
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

      if (currentVal >= lastEmojiThreshold + 0.18 && currentVal <= 5.0) {
        spawnEmoji(currentVal);
        lastEmojiThreshold = currentVal;
      }

      if (frame >= totalFrames) {
        setDisplay("5.0");
        clearInterval(counter);
        for (let i = 0; i < 4; i++) {
          const t = setTimeout(() => spawnEmoji(5.0), i * 100);
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
  }, []);

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

export default function RatingSummary() {
  return (
    <section className="border-b border-gray-200 py-8">
      <style>{LAUREL_STYLES}</style>
      <div className="mb-6 flex flex-col items-center">
        <AnimatedRating />
        <p className="mt-3 text-lg font-semibold text-gray-900">Guest favourite</p>
        <p className="mt-1 max-w-sm text-center text-sm text-gray-600">
          This home is a guest favourite based on ratings, reviews and reliability
        </p>
        <button className="mt-2 text-xs text-gray-700 underline">How reviews work</button>
      </div>

      <div className="grid grid-cols-7 gap-4 border-t border-gray-200 pt-6 text-sm">
        <div>
          <div className="mb-2 text-xs font-semibold text-gray-900">Overall rating</div>
          {BARS.map((b) => (
            <div key={b.star} className="flex items-center gap-2">
              <span className="w-3 text-xs text-gray-700">{b.star}</span>
              <div className="h-1 flex-1 rounded-full bg-gray-200">
                <div className={`h-full rounded-full bg-gray-900 ${b.w}`} />
              </div>
            </div>
          ))}
        </div>
        {CATEGORIES.map((c) => (
          <div key={c.label} className="border-l border-gray-200 pl-4">
            <div className="text-xs font-semibold text-gray-900">{c.label}</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{c.value}</div>
            <i className={`fa-solid ${c.icon} mt-2 text-xl text-gray-800`} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar">
        {["Pool","Hospitality","Cleanliness","Family","Check-in","Location","Accuracy","Condition","Comfort"].map((t) => (
          <button key={t} className="flex shrink-0 items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800">
            <i className="fa-solid fa-circle text-xs" /> {t}
          </button>
        ))}
      </div>
    </section>
  );
}
