const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=70`;

const IMAGES = [
  img("photo-1600585154340-be6161a56a0c"),
  img("photo-1613490493576-7fde63acd811"),
  img("photo-1600607687939-ce8a6c25118c"),
  img("photo-1600566753190-17f0baa2a6c3"),
  img("photo-1616486338812-3dadae4b4ace"),
];

export default function ImageGallery() {
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

      <div className="mt-4 grid h-115 grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
        <img
          src={IMAGES[0]}
          alt="Main"
          className="col-span-2 row-span-2 h-full w-full object-cover"
        />
        <img src={IMAGES[1]} alt="" className="h-full w-full object-cover" />
        <img src={IMAGES[2]} alt="" className="h-full w-full object-cover" />
        <img src={IMAGES[3]} alt="" className="h-full w-full object-cover" />
        <div className="relative h-full w-full">
          <img
            src={IMAGES[4]}
            alt=""
            className="h-full w-full object-cover"
          />
          <button className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-gray-900 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow">
            <i className="fa-solid fa-table-cells" /> Show all photos
          </button>
        </div>
      </div>
    </section>
  );
}
