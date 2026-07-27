import { useEffect, useState } from "react";

export default function HostSection({ hostId }) {
  const [host, setHost] = useState(null);
  const [hostStats, setHostStats] = useState({ totalReviews: 0, rating: 0, yearsHosting: 0 });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.id === hostId);
    setHost(found || null);

    if (found) {
      const listings = JSON.parse(localStorage.getItem("listings")) || [];
      const hostListings = listings.filter(l => l.hostId === hostId);

      let totalReviews = 0;
      let totalWeightedRating = 0;
      hostListings.forEach(l => {
        totalReviews += l.reviewCount || 0;
        totalWeightedRating += (l.rating || 0) * (l.reviewCount || 0);
      });
      const avgRating = totalReviews > 0 ? totalWeightedRating / totalReviews : 0;

      const createdAt = found.joinedAt ? new Date(found.joinedAt) : new Date();
      const years = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25)));

      setHostStats({
        totalReviews,
        rating: Math.round(avgRating * 10) / 10,
        yearsHosting: years || 0,
      });
    }
  }, [hostId]);

  if (!host) {
    return (
      <section className="border-b border-gray-200 py-8">
        <p className="text-gray-500">Host information not available</p>
      </section>
    );
  }

  const { totalReviews, rating, yearsHosting } = hostStats;

  return (
    <section className="border-b border-gray-200 py-8">
      <h3 className="mb-6 text-xl font-semibold text-gray-900">Meet your host</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={host.avatar || "https://i.pravatar.cc/160?img=13"}  // ✅ changed from profilePhoto to avatar
                alt={host.name}
                className="h-28 w-28 rounded-full object-cover"
              />
              <span className="absolute bottom-2 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white">
                <i className="fa-solid fa-check text-xs" />
              </span>
            </div>
            <div className="mt-2 text-xl font-bold text-gray-900">{host.name}</div>
            <div className="text-xs text-gray-700">
              <i className="fa-solid fa-medal" /> Superhost
            </div>
          </div>
          <div className="flex-1 space-y-3 border-l border-gray-200 pl-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">{totalReviews}</div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="font-semibold text-gray-900">{rating > 0 ? `${rating} ★` : "—"}</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="font-semibold text-gray-900">{yearsHosting}</div>
              <div className="text-xs text-gray-500">Year{yearsHosting !== 1 ? "s" : ""} hosting</div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{host.name} is a Superhost</p>
          <p className="mt-2 text-sm text-gray-700">
            Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
          </p>
          <p className="mt-6 font-semibold text-gray-900">Host details</p>
          <p className="mt-2 text-sm text-gray-700">Response rate: {host.responseRate || 0}%</p>
          <p className="text-sm text-gray-700">{host.responseTime || "N/A"}</p>
          <button className="mt-6 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900">
            Message host
          </button>
          <p className="mt-6 flex items-start gap-2 text-xs text-gray-600">
            <i className="fa-solid fa-shield mt-0.5 text-pink-500" />
            To help protect your payment, always use StayNest to send money and communicate with hosts.
          </p>
        </div>
      </div>
    </section>
  );
}