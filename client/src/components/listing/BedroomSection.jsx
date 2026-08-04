import { useEffect, useRef, useState } from "react";

export default function BedroomSection({ list }) {
  const bedrooms = list.bedrooms || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(bedrooms.length > 1);
  const mobileRef = useRef(null);

  useEffect(() => {
    setCanNext(bedrooms.length > 1);
  }, [bedrooms.length]);

  useEffect(() => {
    function handleResize() {
      if (!mobileRef.current) return;
      const el = mobileRef.current;
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCurrentIndex(idx);
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="border-b border-gray-200 dark:border-gray-700 py-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Where you'll sleep</h3>

      <div className="block lg:hidden">
        <div className="relative rounded-2xl overflow-hidden">
          <button
            onClick={() => {
              if (!mobileRef.current) return;
              const w = mobileRef.current.clientWidth;
              mobileRef.current.scrollBy({ left: -w, behavior: "smooth" });
            }}
            disabled={!canPrev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous bedroom"
          >
            <i className="fa-solid fa-chevron-left text-gray-800 dark:text-gray-100" />
          </button>

          <div
            ref={mobileRef}
            onScroll={() => {
              if (!mobileRef.current) return;
              const el = mobileRef.current;
              const idx = Math.round(el.scrollLeft / el.clientWidth);
              setCurrentIndex(idx);
              setCanPrev(el.scrollLeft > 4);
              setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
            }}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {bedrooms.map((b) => (
              <div key={b.id} className="w-full flex-shrink-0 snap-start px-4 pt-2 pb-6">
                <div className="aspect-4/3 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <img
                    src={b.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70"}
                    alt={b.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{b.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{b.beds} bed{b.beds > 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (!mobileRef.current) return;
              const w = mobileRef.current.clientWidth;
              mobileRef.current.scrollBy({ left: w, behavior: "smooth" });
            }}
            disabled={!canNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next bedroom"
          >
            <i className="fa-solid fa-chevron-right text-gray-800 dark:text-gray-100" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {bedrooms.map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  mobileRef.current && mobileRef.current.scrollTo({ left: i * mobileRef.current.clientWidth, behavior: "smooth" })
                }
                className={`h-2 w-2 rounded-full ${currentIndex === i ? "bg-gray-900 dark:bg-white" : "bg-gray-300 dark:bg-gray-600"}`}
                aria-label={`Go to bedroom ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {bedrooms.map((b) => (
          <div key={b.id}>
            <div className="aspect-4/3 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <img
                src={b.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70"}
                alt={b.title}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{b.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{b.beds} bed{b.beds > 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}