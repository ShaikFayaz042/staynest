export default function BookingCard({list}) {
  return (
    <aside className="sticky top-24 space-y-4">
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-pink-500 text-white">
          <i className="fa-solid fa-tag text-[10px]" />
        </span>
        <span className="text-sm font-medium text-gray-900">Prices include all fees</span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-4">
          <span className="text-gray-500 line-through">₹21,691</span>{" "}
          <span className="text-lg font-semibold text-gray-900 underline">₹17,006</span>{" "}
          <span className="text-sm text-gray-700">for 2 nights</span>
        </div>

        <div className="mb-3 grid grid-cols-2 rounded-xl border border-gray-300">
          <div className="border-r border-gray-300 p-3">
            <div className="text-[10px] font-bold text-gray-900">CHECK-IN</div>
            <div className="text-sm text-gray-700">7/17/2026</div>
          </div>
          <div className="p-3">
            <div className="text-[10px] font-bold text-gray-900">CHECKOUT</div>
            <div className="text-sm text-gray-700">7/19/2026</div>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-gray-300 p-3">
          <div className="text-[10px] font-bold text-gray-900">GUESTS</div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>1 guest</span>
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <button className="w-full rounded-full bg-linear-to-r from-[#E61E4D] to-[#D70466] py-3 text-base font-semibold text-white">
          Reserve
        </button>
        <p className="mt-3 text-center text-sm text-gray-600">You won't be charged yet</p>
      </div>
    </aside>
  );
}
