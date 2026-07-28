import { useState, useRef, useEffect } from "react";
import categories from "../../data/categories";

export default function CategoryBar() {
  const [active, setActive] = useState("");
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const containerRef = useRef(null);

  function handleClick(e) {
    containerRef.current.scrollBy({
      left: e.currentTarget.id === "next" ? 300 : -300,
      behavior: "smooth",
    });
  }

  function updateButtons() {
    const el = containerRef.current;
    if (!el) return;
    
    setIsStart(el.scrollLeft <= 0);
    // Math.ceil prevents the button from getting stuck due to fractional pixel widths on zoomed displays
    setIsEnd(Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth);
  }

  useEffect(() => {
    updateButtons();
    window.addEventListener("resize", updateButtons);
    return () => window.removeEventListener("resize", updateButtons);
  }, []);

  function handleCategory(name) {
    // Best practice: use previous state to toggle
    setActive((prev) => (prev === name ? "" : name));
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-8xl mx-auto px-4 md:px-8 flex items-center gap-3 py-1">

        {/* Previous Button */}
        {!isStart && (
          <button
            id="prev"
            onClick={handleClick}
            aria-label="Scroll left"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10"
          >
            <i className="fa-solid fa-angle-left text-sm text-gray-700 dark:text-gray-300"></i>
          </button>
        )}

        {/* Categories */}
        <div
          ref={containerRef}
          onScroll={updateButtons}
          className="flex flex-1 items-center gap-8 overflow-x-auto py-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          {categories.map((cat) => {
            const isActive = active === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.name)}
                className={`flex shrink-0 flex-col items-center gap-2 border-b-2 pb-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-2xl`} aria-hidden="true" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {!isEnd && (
          <button
            id="next"
            onClick={handleClick}
            aria-label="Scroll right"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10"
          >
            <i className="fa-solid fa-angle-right text-sm text-gray-700 dark:text-gray-300"></i>
          </button>
        )}
      </div>
    </div>
  );
}