import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

export default function MyTripsPage() {
  const { user } = useAuth();
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const listings = JSON.parse(localStorage.getItem("listings")) || [];

  // Find bookings made by this user
  const userBookings = bookings.filter(b => b.userId === user?.id);
  const tripListings = userBookings.map(b => {
    const listing = listings.find(l => l.id === b.listingId);
    return { ...b, listing };
  });

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navbar type="travelling" variant="profile" />
      <main className="max-w-6xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-3xl font-extrabold">My Trips</h1>
        <p className="text-gray-600 mt-1">All your past and upcoming stays</p>

        {user ? (
          tripListings.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripListings.map((trip) => (
                <div key={trip.id} className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
                  <img
                    src={trip.listing?.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70"}
                    alt={trip.listing?.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="font-semibold">{trip.listing?.title || "Unknown"}</div>
                    <div className="text-sm text-gray-500">
                      {trip.listing?.location?.city || "N/A"} · {trip.listing?.category || ""}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Check-in:</span> {new Date(trip.checkIn).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Check-out:</span> {new Date(trip.checkOut).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-bold mt-1">₹{trip.totalPrice}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-gray-500">
              <p className="text-xl">You don't have any trips yet.</p>
              <p className="text-sm mt-1">Start exploring and book your first stay!</p>
            </div>
          )
        ) : (
          <div className="mt-12 text-center text-gray-500">
            <p className="text-xl">Please log in to see your trips.</p>
          </div>
        )}
      </main>
    </div>
  );
}