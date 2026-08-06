import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isListingSaved, toggleListingWishlist } from "../../utils/wishlist";

export default function ImageGallery({ list }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const saved = isListingSaved(user?.id, list.id);

  // Mobile carousel state
  const mobileRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(list.images && list.images.length > 1);
  const scrollTimeoutRef = useRef(null);

  const handleSaveClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleListingWishlist(user.id, list.id);
    setSaveToggle(!saveToggle);
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // init canNext based on images
    setCanNext(list.images && list.images.length > 1);
  }, [list.images]);

  useEffect(() => {
    // on resize, recalc current index
    function onResize() {
      if (!mobileRef.current) return;
      const el = mobileRef.current;
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCurrentIndex(idx);
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section className="mt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="max-w-[65ch] text-2xl font-bold text-gray-900 dark:text-white">
          {list.title || "Luxury Lakeside 2BHK Villa | Near Baga Beach"}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-800 dark:text-gray-300">
          <button onClick={handleBack} className="hidden items-center gap-1 underline md:flex">
            <i className="fa-solid fa-arrow-left" /> Back
          </button>
          <button className="flex items-center gap-1 underline">
            <i className="fa-solid fa-arrow-up-from-bracket" /> Share
          </button>
          <button onClick={handleSaveClick} className="flex items-center gap-1 underline">
            <i className={`${saved ? "fa-solid fa-heart text-[#fd4148]" : "fa-regular fa-heart"}`} /> {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Mobile carousel: single container horizontal scroll */}
      <div className="block md:hidden">
        <div className="relative rounded-2xl overflow-hidden">
          <button
            onClick={() => {
              if (!mobileRef.current) return;
              const w = mobileRef.current.clientWidth;
              mobileRef.current.scrollBy({ left: -w, behavior: 'smooth' });
            }}
            disabled={!canPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 dark:bg-gray-800/80 p-2 shadow-md"
            aria-label="Previous photo"
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
            {list.images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0 snap-start">
                <img loading="lazy" src={image} alt={`Property view ${index + 1}`} className="w-full h-64 object-cover" />
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (!mobileRef.current) return;
              const w = mobileRef.current.clientWidth;
              mobileRef.current.scrollBy({ left: w, behavior: 'smooth' });
            }}
            disabled={!canNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 dark:bg-gray-800/80 p-2 shadow-md"
            aria-label="Next photo"
          >
            <i className="fa-solid fa-chevron-right text-gray-800 dark:text-gray-100" />
          </button>

          {/* indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {list.images.map((_, i) => (
              <button key={i} onClick={() => mobileRef.current && mobileRef.current.scrollTo({ left: i * mobileRef.current.clientWidth, behavior: 'smooth' })} className={`w-2 h-2 rounded-full ${currentIndex === i ? 'bg-white dark:bg-gray-100' : 'bg-white/50 dark:bg-gray-700/50'}`} aria-label={`Go to photo ${i+1}`} />
            ))}
          </div>
        </div>
      </div>

      <div className={`hidden md:block mt-4 overflow-hidden transition-all duration-700 ease-in-out ${
          showAllPhotos ? "" : "rounded-2xl"
        }`}>

        <div
          className={`grid gap-1 transition-all duration-700 ${
            showAllPhotos
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-2 auto-rows-fr"
          }`}
        >
          {list.images.map((image, index) => {
            const isHiddenWhenClosed = !showAllPhotos && index > 4;
            const isMainImage = !showAllPhotos && index === 0;

            return (
              <div
                key={index}
                className={`relative w-full overflow-hidden ${
                  isHiddenWhenClosed ? "hidden" : "block"
                } ${isMainImage ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className={`${
                  showAllPhotos
                    ? "aspect-[4/3] rounded-xl"
                    : isMainImage
                    ? "aspect-[16/10] h-full"
                    : "aspect-[4/3]"
                } overflow-hidden w-full`}
                >
                  <img
                    src={image}
                    alt={`Property view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {!showAllPhotos && index === 4 && (
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-gray-900 dark:border-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fa-solid fa-table-cells" />
                    Show all photos
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAllPhotos && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAllPhotos(false)}
            className="flex items-center gap-2 rounded-lg border border-gray-900 dark:border-gray-300 bg-white dark:bg-gray-800 px-6 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <i className="fa-solid fa-chevron-up" />
            Show less
          </button>
        </div>
      )}
    </section>
  );
}