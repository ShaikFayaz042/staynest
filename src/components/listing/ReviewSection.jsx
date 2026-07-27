import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

export default function ReviewSection({ reviewIds = [] }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const filtered = allReviews.filter(r => reviewIds.includes(r.id));
    setReviews(filtered);
    setShowAll(false);
  }, [reviewIds]);

  if (reviews.length === 0) {
    return (
      <section className="border-b border-gray-200 py-8">
        <p className="text-gray-500">No reviews yet.</p>
      </section>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);
  const hasMore = reviews.length > 4;

  return (
    <section className="border-b border-gray-200 py-8">
      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        {displayedReviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </section>
  );
}