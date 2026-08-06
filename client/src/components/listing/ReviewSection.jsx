import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ReviewSection({ listingId }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchReviews = async () => {
      if (!listingId) {
        setReviews([]);
        setShowAll(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/reviews?listing=${listingId}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(Array.isArray(data?.data) ? data.data : []);
        setShowAll(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
        setReviews([]);
        setShowAll(false);
      }
    };

    fetchReviews();
    return () => controller.abort();
  }, [listingId]);

  if (reviews.length === 0) {
    return (
      <section className="border-b border-gray-200 dark:border-gray-700 py-8">
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      </section>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);
  const hasMore = reviews.length > 4;

  return (
    <section className="border-b border-gray-200 dark:border-gray-700 py-8">
      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        {displayedReviews.map((r) => (
          <ReviewCard key={r._id || r.id} review={r} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-lg border border-gray-900 dark:border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </section>
  );
}