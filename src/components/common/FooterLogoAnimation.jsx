import { useEffect, useRef } from "react";

export default function FooterLogoAnimation() {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    path.animate(
      [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
      { duration: 1600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
    );
  }, []);

  return (
    <>
      <style>{`
        .sn-fla-container {
        margin-left:50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: sn-fla-float 4s ease-in-out infinite 3s;
        }
        .sn-fla-mark {
          width: 100px;
          height: 190px;
          margin-bottom: -40px;
          overflow: visible;
          filter: drop-shadow(0px 8px 16px rgba(255, 71, 87, 0.15));
        }
        .sn-fla-house {
          fill: none;
          stroke: #ff4757;
          stroke-width: 15;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .sn-fla-window {
          fill: #1e272e;
          opacity: 0;
          transform: scale(0);
        }
        .sn-fla-w1 { transform-origin: 90.55px 82px; animation: sn-fla-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.1s forwards; }
        .sn-fla-w2 { transform-origin: 109.45px 82px; animation: sn-fla-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.25s forwards; }
        .sn-fla-w3 { transform-origin: 90.55px 100px; animation: sn-fla-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.4s forwards; }
        .sn-fla-w4 { transform-origin: 109.45px 100px; animation: sn-fla-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.55s forwards; }

        .sn-fla-text {
          display: flex;
          font-family: 'Montserrat', sans-serif;
          font-size: 2.4rem;
          font-weight: 700;
          letter-spacing: -1.5px;
          overflow: hidden;
          padding: 10px 20px;
        }
        .sn-fla-stay { color: #1e272e; transform: translateY(100%); opacity: 0;
          animation: sn-fla-slide 0.8s cubic-bezier(0.16,1,0.3,1) 1.8s forwards; }
        .sn-fla-nest { color: #ff4757; transform: translateY(100%); opacity: 0;
          animation: sn-fla-slide 0.8s cubic-bezier(0.16,1,0.3,1) 1.95s forwards; }

        .sn-fla-tagline {
          display: flex; align-items: center; gap: 12px;
          font-family: 'Poppins', 'Inter', 'Segoe UI', sans-serif; color: #334155;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; opacity: 0; transform: translateY(10px);
          animation: sn-fla-fadeup 0.8s ease-out 2.4s forwards;
        }
        .sn-fla-line {
          height: 2px; width: 40px; background-color: #ff4757;
          border-radius: 2px; opacity: 0; transform: scaleX(0);
          animation: sn-fla-expand 0.6s cubic-bezier(0.16,1,0.3,1) 2.6s forwards;
        }

        @keyframes sn-fla-pop {
          0% { opacity: 0; transform: scale(0) rotate(-10deg); }
          70% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes sn-fla-slide { 0%{transform:translateY(100%);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes sn-fla-fadeup { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes sn-fla-expand { 0%{transform:scaleX(0);opacity:0} 100%{transform:scaleX(1);opacity:1} }
        @keyframes sn-fla-float { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }
      `}</style>

      <div className="sn-fla-container">
        <svg className="sn-fla-mark" viewBox="0 0 210 250" xmlns="http://www.w3.org/2000/svg">
          <path
            ref={pathRef}
            className="sn-fla-house"
            d="M 108 29.06
               Q 100 23.06, 92 29.06
               L 22.75 81
               Q 10.75 90, 10.75 100
               V 165
               C 10.75 221, 58 246, 100 206
               C 119 187, 122.25 173, 122.25 160
               A 22.25 22.25 0 0 0 77.75 160
               C 77.75 173, 81 187, 100 206
               C 142 246, 189.25 221, 189.25 165
               V 100
               Q 189.25 90, 177.25 81
               Z"
          />
          <rect className="sn-fla-window sn-fla-w1" x="83.2" y="75" width="14.7" height="14" rx="2" />
          <rect className="sn-fla-window sn-fla-w2" x="102.1" y="75" width="14.7" height="14" rx="2" />
          <rect className="sn-fla-window sn-fla-w3" x="83.2" y="93" width="14.7" height="14" rx="2" />
          <rect className="sn-fla-window sn-fla-w4" x="102.1" y="93" width="14.7" height="14" rx="2" />
        </svg>

        <div className="sn-fla-text">
          <span className="sn-fla-stay">Stay</span>
          <span className="sn-fla-nest">Nest</span>
        </div>

        <div className="sn-fla-tagline">
          <span className="sn-fla-line" />
          Find Your Perfect Stay
          <span className="sn-fla-line" />
        </div>
      </div>
    </>
  );
}
