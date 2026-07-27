import { useState } from "react";

export default function ImageGallery({ list }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  return (
    <section className="mt-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Luxury Lakeside 2BHK Villa | Near Baga Beach
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-800">
          <button className="flex items-center gap-1 underline">
            <i className="fa-solid fa-arrow-up-from-bracket" /> Share
          </button>

          <button className="flex items-center gap-1 underline">
            <i className="fa-regular fa-heart" /> Save
          </button>
        </div>
      </div>

      {/* Main Wrapper: Controls the height animation */}
      <div
        className={`mt-4 overflow-hidden transition-[max-height] duration-700 ease-in-out ${
          showAllPhotos
            ? "max-h-[5000px]" // Expand hone par maximum height allow karega
            : "max-h-[60vh] min-h-100 rounded-2xl" // 5-image collage ke liye fixed height
        }`}
      >
        {/* Dynamic Grid */}
        <div
          className={`grid gap-2 transition-all duration-700 ${
            showAllPhotos
              ? "grid-cols-1 md:grid-cols-2 h-auto" // Open state: Standard grid sabhi photos ke liye
              : "grid-cols-4 grid-rows-2 h-full"    // Closed state: Airbnb style 1 Main, 4 Secondary
          }`}
        >
          {list.images.map((image, index) => {
            // STRICT RULE: Closed state me 5th image ke baad sab kuch completely hide kar do 
            // Taaki wo initial 1+4 grid layout ko squash na karein
            const isHiddenWhenClosed = !showAllPhotos && index > 4;

            // Closed state me sirf pehli image (index 0) ko 2x2 blocks dena hai
            const isMainImage = !showAllPhotos && index === 0;

            return (
              <div
                key={index}
                className={`relative w-full ${
                  isHiddenWhenClosed ? "hidden" : "block"
                } ${
                  isMainImage ? "col-span-2 row-span-2" : "" // Main Photo Layout
                } ${
                  showAllPhotos ? "h-64 md:h-100" : "h-full" // Height management
                }`}
              >
                <img
                  src={image}
                  alt={`Property view ${index + 1}`}
                  className={`h-full w-full object-cover ${
                    showAllPhotos ? "rounded-xl" : ""
                  }`}
                />

                {/* Show All Button - Exactly 5th image (index 4) ke upar overlap karega */}
                {!showAllPhotos && index === 4 && (
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-gray-900 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow hover:bg-gray-100"
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

      {/* Show Less Button */}
      {showAllPhotos && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAllPhotos(false)}
            className="flex items-center gap-2 rounded-lg border border-gray-900 bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-gray-100 transition-all"
          >
            <i className="fa-solid fa-chevron-up" />
            Show less
          </button>
        </div>
      )}
    </section>
  );
}