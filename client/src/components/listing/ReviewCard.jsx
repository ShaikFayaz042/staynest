import { useState, useEffect } from "react";

export default function ReviewCard({ review }) {
  const user = typeof review.user === "object" && review.user !== null ? review.user : null;
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Unknown";
  const name = user?.name || "Anonymous";
  const avatar = user?.avatar || user?.profile || "";
  const joinYears = user?.joinedAt ? `${new Date().getFullYear() - new Date(user.joinedAt).getFullYear()} years on StayNest` : "";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-semibold text-gray-800 dark:text-gray-200">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {joinYears}
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
        <span className="text-gray-900 dark:text-white">
          {"★".repeat(Math.round(review.rating || 0))}
          {"☆".repeat(5 - Math.round(review.rating || 0))}
        </span>
        {" · "} {date}
      </div>
      <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{review.comment || ""}</p>
    </div>
  );
}