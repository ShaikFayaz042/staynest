import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import { getUserWishlists } from "../utils/wishlist";

export default function WishlistsPage() {
  const { user } = useAuth();
  const wishlists = getUserWishlists(user?.id);
  const listings = JSON.parse(localStorage.getItem("listings")) || [];

  const wishlistListingIds = wishlists.flatMap((list) => list.listingIds || []);
  const wishlistListings = listings.filter((listing) => wishlistListingIds.includes(listing.id));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navbar type="travelling" variant="profile" />
      <main className="max-w-6xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Wishlists</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Your saved listings</p>

        {user ? (
          wishlistListings.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistListings.map((listing) => (
                <div key={listing.id} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition bg-white dark:bg-gray-800">
                  <img
                    src={listing.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{listing.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{listing.category} · {listing.location?.city}</div>
                    <div className="text-sm font-bold mt-1 text-gray-900 dark:text-white">₹{listing.pricePerNight} / night</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-xl">Your wishlist is empty.</p>
              <p className="text-sm mt-1">Save listings you love to your wishlist!</p>
            </div>
          )
        ) : (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl">Please log in to view your wishlists.</p>
          </div>
        )}
      </main>
    </div>
  );
}