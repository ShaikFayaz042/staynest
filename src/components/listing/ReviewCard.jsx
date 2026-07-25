export default function ReviewCard({ review }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        {review.avatar ? (
          <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-gray-800 ${review.bg || "bg-gray-200"}`}>
            {review.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-gray-900">{review.name}</div>
          <div className="text-xs text-gray-500">{review.years}</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-700">
        <span className="text-gray-900">★★★★★</span> · {review.date}
      </div>
      <p className="mt-2 text-sm text-gray-800">{review.text}</p>
      {review.showMore && (
        <button className="mt-1 text-sm text-gray-900 underline">Show more</button>
      )}
    </div>
  );
}
