import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

const apiUrl = import.meta.env.VITE_API_URL;

export default function MyTripsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadBookings() {
      try {
        const response = await fetch(`${apiUrl}/bookings`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Unable to load your trips right now.");
        }
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
    return () => controller.abort();
  }, [user]);

  const tripBookings = bookings.map((booking) => ({
    ...booking,
    id: booking._id || booking.id,
    listing: booking.listing || {},
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navbar type="travelling" variant="profile" />
      <main className="max-w-6xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Trips</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">All your past and upcoming stays</p>

        {user ? (
          tripBookings.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripBookings.map((trip) => (
                <div key={trip.id} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition bg-white dark:bg-gray-800">
                  <img
                    src={trip.listing?.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70"}
                    alt={trip.listing?.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{trip.listing?.title || "Unknown"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {trip.listing?.location?.city || "N/A"} · {trip.listing?.category || ""}
                    </div>
                    <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Check-in:</span> {new Date(trip.checkIn).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Check-out:</span> {new Date(trip.checkOut).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-bold mt-1 text-gray-900 dark:text-white">₹{trip.totalPrice}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-xl">You don't have any trips yet.</p>
              <p className="text-sm mt-1">Start exploring and book your first stay!</p>
            </div>
          )
        ) : (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl">Please log in to see your trips.</p>
          </div>
        )}
      </main>
    </div>
  );
}