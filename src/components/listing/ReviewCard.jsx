// src/components/listing/ReviewCard.jsx
import { useState, useEffect } from "react";

export default function ReviewCard({ review }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (review.userId) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find(u => u.id === review.userId);
      setUser(found || null);
    }
  }, [review.userId]);

  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Unknown";
  const name = user?.name || "Anonymous";
  const avatar = user?.avatar || "";

  return (
    <div>
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-800">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">
            {user?.joinedAt ? `${new Date().getFullYear() - new Date(user.joinedAt).getFullYear()} years on StayNest` : ""}
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-700">
        <span className="text-gray-900">
          {"★".repeat(Math.round(review.rating || 0))}
          {"☆".repeat(5 - Math.round(review.rating || 0))}
        </span>
        {" · "} {date}
      </div>
      <p className="mt-2 text-sm text-gray-800">{review.comment || ""}</p>
    </div>
  );
}