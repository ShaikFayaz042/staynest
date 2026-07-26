import { useState } from "react";

export default function ImageGallery({ list }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  return (
    <>
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

        <div className="mt-4 grid h-115 grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
          <img
            src={list.images[0]}
            alt=""
            className="col-span-2 row-span-2 h-full w-full object-cover"
          />

          <img
            src={list.images[1]}
            alt=""
            className="h-full w-full object-cover"
          />

          <img
            src={list.images[2]}
            alt=""
            className="h-full w-full object-cover"
          />

          <img
            src={list.images[3]}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="relative h-full w-full">
            <img
              src={list.images[4]}
              alt=""
              className="h-full w-full object-cover"
            />

            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-gray-900 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow hover:bg-gray-100"
            >
              <i className="fa-solid fa-table-cells" />
              Show all photos
            </button>
          </div>
        </div>
      </section>

      {/* Fullscreen Gallery */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setShowAllPhotos(false)}
                className="rounded-lg bg-white px-4 py-2 font-medium hover:bg-gray-100"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back
              </button>

              <h2 className="text-xl font-semibold text-white">
                All Photos
              </h2>

              <div></div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {list.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className="w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}