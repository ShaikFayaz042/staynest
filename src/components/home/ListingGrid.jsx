import { useEffect, useRef, useState } from "react";
import ListingCard from "./ListingCard";

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;

const IMAGES = [
  img("photo-1560448204-e02f11c3d0e2"),
  img("photo-1505693416388-ac5ce068fe85"),
  img("photo-1600585154340-be6161a56a0c"),
  img("photo-1512917774080-9991f1c4c750"),
  img("photo-1522708323590-d24dbb6b0267"),
  img("photo-1502672260266-1c1ef2d93688"),
  img("photo-1493809842364-78817add7ffb"),
];

const buildListings = (city, count = 10) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${city}-${i}`,
    image: IMAGES[i % IMAGES.length],
    title: `${["Flat", "Home", "Villa", "Room", "Apartment", "Tiny home", "Home"][i % 7]} in ${city}`,
    price: `₹${(4000 + i * 850).toLocaleString("en-IN")}`,
    nights: "2 nights",
    rating: (4.8 + (i % 3) * 0.05).toFixed(2),
    guestFavourite: true,
  }));

const SECTIONS = [
  { title: "Popular homes in North Goa", listings: buildListings("Candolim") },
  { title: "Available in Gurgaon District this weekend", listings: buildListings("Gurugram") },
  { title: "Stay in Manali", listings: buildListings("Manali") },
  { title: "Available in Shimla this weekend", listings: buildListings("Shimla") },
];

function ScrollRow({ section }) {
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center justify-between gap-4">
        <a
          href="#"
          className="flex items-center gap-1 text-lg font-semibold text-gray-900 hover:underline"
        >
          {section.title}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="sn-hscroll -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-2 pb-2"
      >
        {section.listings.map((l) => (
          <div
            key={l.id}
            className="w-[calc((100%-1.5rem)/2)] shrink-0 snap-start sm:w-[calc((100%-3rem)/3)] md:w-[calc((100%-4.5rem)/4)] lg:w-[calc((100%-6rem)/5)]"
          >
            <ListingCard listing={l} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ListingGrid() {
  return (
    <div className="mx-auto w-full max-w-350 px-6 py-6 md:px-10">
      <style>{`
        .sn-hscroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sn-hscroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {SECTIONS.map((s) => (
        <ScrollRow key={s.title} section={s} />
      ))}
    </div>
  );
}
