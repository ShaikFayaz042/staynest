import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ReviewCard from "./ReviewCard";

const apiUrl = import.meta.env.VITE_API_URL;
const CATEGORY_MAP = {
  cleanliness: "Cleanliness",
  accuracy: "Accuracy",
  checkIn: "Check-in",
  communication: "Communication",
  location: "Location",
  value: "Value",
};

export default function ReviewSection({ listingId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [categories, setCategories] = useState({
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 5,
    value: 5,
  });
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
    : 0;

  const categoryAverages = Object.keys(CATEGORY_MAP).reduce((acc, key) => {
    const scores = reviews
      .map((review) => review.categories?.[key])
      .filter((score) => typeof score === "number");

    acc[key] = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    return acc;
  }, {});

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const response = await fetch(`${apiUrl}/reviews?listing=${listingId}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
        setReviews([]);
      }
    }

    loadReviews();
    return () => controller.abort();
  }, [listingId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess("");

    if (!user) {
      setMessage("Please log in to submit a review.");
      return;
    }

    if (!comment.trim()) {
      setMessage("Please write a review before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing: listingId,
          rating,
          comment: comment.trim(),
          categories,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit review");
      }

      const reviewWithUser = {
        ...data.data,
        user: {
          name: user?.name || "You",
          avatar: user?.avatar || user?.profile || "",
          joinedAt: user?.joinedAt || new Date().toISOString(),
        },
      };

      setReviews((prev) => [reviewWithUser, ...prev]);
      setSuccess("Review submitted successfully.");
      setComment("");
      setRating(5);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Unable to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reviews</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">Review this listing</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
                Share your experience and help future guests make a decision.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Overall rating</label>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`transition-transform duration-200 ${rating >= value ? "scale-110 text-yellow-400 hover:scale-125" : "text-gray-300 dark:text-gray-600 hover:scale-110"}`}
                        aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      >
                        <i className="fa-solid fa-star text-2xl" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100">
                        <span>{label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{categories[key]} / 5</span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setCategories((prev) => ({ ...prev, [key]: value }))}
                            className={` p-2 transition-transform duration-200 ${categories[key] >= value ? " text-yellow-400  scale-110 hover:scale-125" : " text-gray-300 hover:scale-110  dark:text-gray-600"}`}
                            aria-label={`${label} ${value} star${value > 1 ? "s" : ""}`}
                          >
                            <i className="fa-solid fa-star" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor="comment">
                    Your review
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="What did you like about this stay?"
                    className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-[#E61E4D] to-[#D70466] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit review"}
                </button>

                {(message || success) && (
                  <p className={`text-sm ${success ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                    {success || message}
                  </p>
                )}
              </form>
            </div>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id || review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  No reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
