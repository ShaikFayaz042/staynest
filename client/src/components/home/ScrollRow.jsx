import { useEffect, useRef, useState } from "react";
import ListingCard from "./ListingCard";

export default function ScrollRow({ title, listings }) {
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  function updateButtons() {
    const el = scrollerRef.current;
    if (!el) return;
    const scrollable = el.scrollWidth > el.clientWidth + 1;
    setIsScrollable(scrollable);
    if (!scrollable) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  function scroll(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.9,
      behavior: "smooth",
    });
  }

  return (
    <section>
      <div className="mb-4 flex flex-nowrap items-center justify-between gap-3">
        <button className="min-w-0 flex items-center gap-1 text-lg font-semibold text-gray-900 dark:text-white hover:underline">
          <span className="truncate">{title}</span>
          <i className="fa-solid fa-angle-right mt-0.5 text-sm text-gray-700 dark:text-gray-400"></i>
        </button>

        {isScrollable && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
            >
              <i className="fa-solid fa-angle-left text-sm text-gray-700 dark:text-gray-300"></i>
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
            >
              <i className="fa-solid fa-angle-right text-sm text-gray-700 dark:text-gray-300"></i>
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-2 pb-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {listings.map((listing, index) => (
          <div
            key={`${listing.id}-${index}`}
            className="min-w-0 w-[min(100%,220px)] shrink-0 snap-start sm:w-[min(100%,260px)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4rem)/4)] xl:w-[calc((100%-5rem)/5)] 2xl:w-[calc((100%-6rem)/6)]"
          >
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  );
}