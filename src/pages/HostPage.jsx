import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';

export default function HostPage() {
  const { user } = useAuth();
  const listings = JSON.parse(localStorage.getItem('listings')) || [];
  const userListings = user ? listings.filter(l => l.hostId === user.id) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Navbar type="travelling" variant="host-dashboard" />
      <main className="px-4 sm:px-6 md:px-16 py-8 sm:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Your listing</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/host/create"
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <i className="fa-solid fa-plus text-sm text-gray-800 dark:text-gray-200" />
            </Link>
          </div>
        </div>

        {user ? (
          <>
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Welcome, {user.name || user.email}!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userListings.length === 0
                  ? "You don't have any listings yet."
                  : `You have ${userListings.length} listing(s).`}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userListings.length > 0 ? (
                userListings.map(listing => (
                  <div key={listing.id} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition bg-white dark:bg-gray-800">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{listing.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{listing.category} · {listing.location.city}</div>
                      <div className="text-sm font-bold mt-1 text-gray-900 dark:text-white">₹{listing.pricePerNight} / night</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>You haven't created any listings yet.</p>
                  <p className="text-sm mt-1">Click the <strong>“+”</strong> button above to add your first listing.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-8 text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-xl">Please log in to see your listings.</p>
            <Link
              to="/login"
              className="mt-4 inline-block px-6 py-2 bg-[#FF385C] text-white rounded-lg hover:opacity-90"
            >
              Go to Login
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}