import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isListingSaved, toggleListingWishlist } from "../../utils/wishlist";

export default function ImageGallery({ list }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const saved = isListingSaved(user?.id, list.id);

  const handleSaveClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleListingWishlist(user.id, list.id);
    setSaveToggle(!saveToggle);
  };

  return (
    <section className="mt-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {list.title || "Luxury Lakeside 2BHK Villa | Near Baga Beach"}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-800 dark:text-gray-300">
          <button className="flex items-center gap-1 underline">
            <i className="fa-solid fa-arrow-up-from-bracket" /> Share
          </button>
          <button onClick={handleSaveClick} className="flex items-center gap-1 underline">
            <i className={`${saved ? "fa-solid fa-heart text-[#fd4148]" : "fa-regular fa-heart"}`} /> {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div
        className={`mt-4 overflow-hidden transition-[max-height] duration-700 ease-in-out ${
          showAllPhotos ? "max-h-[5000px]" : "max-h-[60vh] min-h-100 rounded-2xl"
        }`}
      >
        <div
          className={`grid gap-2 transition-all duration-700 ${
            showAllPhotos
              ? "grid-cols-1 md:grid-cols-2 h-auto"
              : "grid-cols-4 grid-rows-2 h-full"
          }`}
        >
          {list.images.map((image, index) => {
            const isHiddenWhenClosed = !showAllPhotos && index > 4;
            const isMainImage = !showAllPhotos && index === 0;

            return (
              <div
                key={index}
                className={`relative w-full ${
                  isHiddenWhenClosed ? "hidden" : "block"
                } ${isMainImage ? "col-span-2 row-span-2" : ""} ${
                  showAllPhotos ? "h-64 md:h-100" : "h-full"
                }`}
              >
                <img
                  src={image}
                  alt={`Property view ${index + 1}`}
                  className={`h-full w-full object-cover ${
                    showAllPhotos ? "rounded-xl" : ""
                  }`}
                />

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