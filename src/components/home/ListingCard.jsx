export default function ListingCard({ listing }) {
  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {listing.guestFavourite && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
            Guest favourite
          </span>
        )}
        <button
          type="button"
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-white/90 transition hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-6 w-6"
            style={{
              fill: "rgba(0,0,0,0.5)",
              stroke: "white",
              strokeWidth: 2,
            }}
          >
            <path d="M16 28c7-4.5 12-9 12-15a6 6 0 0 0-12-2 6 6 0 0 0-12 2c0 6 5 10.5 12 15z" />
          </svg>
        </button>
      </div>
      <div className="mt-2 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold text-gray-900">
            {listing.title}
          </h3>
        </div>
        <p className="text-[13px] text-gray-500">
          <span className="underline">{listing.price}</span>
          {listing.nights ? ` for ${listing.nights}` : ""}
          <span className="mx-1">·</span>
          <span className="inline-flex items-center gap-0.5 text-gray-900">
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-current">
              <polygon points="6,0 7.5,4 12,4 8.5,7 10,12 6,9 2,12 3.5,7 0,4 4.5,4" />
            </svg>
            {listing.rating}
          </span>
        </p>
      </div>
    </article>
  );
}
