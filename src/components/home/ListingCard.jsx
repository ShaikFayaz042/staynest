export default function ListingCard({ listing }) {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Guest Favourite */}
        {listing.rating >= 4.4 && (
          <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow">
            Guest favourite
          </div>
        )}

        {/* Wishlist */}
        <i className="fa-regular fa-heart absolute right-3 top-3 text-2xl text-white drop-shadow-md transition hover:scale-110"></i>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold text-gray-900">
            Home in {listing.location.city}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-900">
            <i className="fa-solid fa-star text-[11px]"></i>
            <span>{listing.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-[15px] text-gray-700">
          <span className="font-semibold">
            ₹{listing.pricePerNight.toLocaleString("en-IN")}
          </span>{" "}
          for 2 nights
        </p>
      </div>
    </div>
  );
}