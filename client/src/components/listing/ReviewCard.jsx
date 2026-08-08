const CATEGORY_LABELS = {
  cleanliness: "Cleanliness",
  accuracy: "Accuracy",
  checkIn: "Check-in",
  communication: "Communication",
  location: "Location",
  value: "Value",
};

export default function ReviewCard({ review }) {
  const user = typeof review.user === "object" && review.user !== null ? review.user : null;
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Unknown";
  const name = user?.name || "Anonymous";
  const avatar = user?.avatar || user?.profile || "";
  const joinYears = user?.joinedAt ? `${new Date().getFullYear() - new Date(user.joinedAt).getFullYear()} years on StayNest` : "";
  const categories = review.categories || {};
  const categoryEntries = Object.entries(categories).filter(([, value]) => typeof value === "number" && value > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-3">
      <div className="flex items-center gap-2.5">
        {avatar ? (
          <img src={avatar} alt={name} className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-200 sm:h-9 sm:w-9 sm:text-sm">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <div className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">{name}</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">
            {joinYears}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-700 dark:text-gray-300">
        {[1, 2, 3, 4, 5].map((value) => (
          <i
            key={value}
            className={`fa-solid fa-star text-xs ${Math.round(review.rating || 0) >= value ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
        <span className="ml-2 text-gray-500 dark:text-gray-400">· {date}</span>
      </div>
      <p className="mt-2 text-xs text-gray-800 dark:text-gray-200 sm:text-sm">{review.comment || ""}</p>
      {categoryEntries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
          {categoryEntries.map(([key, value]) => (
            <span
              key={key}
              className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 dark:border-gray-700 dark:bg-gray-900"
            >
              {CATEGORY_LABELS[key] || key}: {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}