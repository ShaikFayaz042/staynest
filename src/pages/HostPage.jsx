// src/pages/HostPage.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
const listings = JSON.parse(localStorage.getItem('listings')) || [];

export default function HostPage() {
  const { user } = useAuth();

  const userListings = user ? listings.filter(l => l.hostId === user.id) : [];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Navbar type="travelling" />
      <main className="px-8 md:px-16 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Your listing</h1>
          <div className="flex items-center gap-3">
            {/* Plus button -> Link to wizard */}
            <Link
              to="/host/create"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <i className="fa-solid fa-plus text-sm" />
            </Link>
          </div>
        </div>

        {user ? (
          <>
            <div className="mt-4">
              <p className="text-lg font-semibold">Welcome, {user.name || user.email}!</p>
              <p className="text-sm text-gray-600">
                {userListings.length === 0
                  ? "You don't have any listings yet."
                  : `You have ${userListings.length} listing(s).`}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.length > 0 ? (
                userListings.map(listing => (
                  <div key={listing.id} className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="font-semibold">{listing.title}</div>
                      <div className="text-sm text-gray-500">{listing.category} · {listing.location.city}</div>
                      <div className="text-sm font-bold mt-1">₹{listing.pricePerNight} / night</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p>You haven't created any listings yet.</p>
                  <p className="text-sm mt-1">Click the <strong>“+”</strong> button above to add your first listing.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-8 text-center py-12 text-gray-500">
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