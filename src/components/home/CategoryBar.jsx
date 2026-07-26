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

    setIsEnd(
      el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
    );
  }

  useEffect(() => {
    updateButtons();

    window.addEventListener("resize", updateButtons);

    return () => {
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  function handleCategory(name){
    if(active === name){
      setActive("");
    }else{
      setActive(name)
    }
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 md:px-8 flex items-center gap-3 py-1">

        {/* Previous */}
        {!isStart && (
          <button
            id="prev"
            onClick={handleClick}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-100 transition z-10"
          >
            <i className="fa-solid fa-angle-left text-sm text-gray-700"></i>
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
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-2xl`} aria-hidden="true" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Next */}
        {!isEnd && (
          <button
            id="next"
            onClick={handleClick}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-100 transition z-10"
          >
            <i className="fa-solid fa-angle-right text-sm text-gray-700"></i>
          </button>
        )}
      </div>
    </div>
  );
}