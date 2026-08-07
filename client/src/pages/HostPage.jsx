import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import { deleteListing, fetchListings } from '../api/listings';

export default function HostPage() {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const loadHostListings = async () => {
    if (!user) {
      setUserListings([]);
      return;
    }

    try {
      const response = await fetchListings();
      const listings = Array.isArray(response?.data) ? response.data : [];
      const filtered = listings.filter((listing) => {
        const hostId = String(listing.host?._id || listing.host || listing.hostId || "");
        return hostId === String(user.id);
      });
      setUserListings(filtered);
    } catch (error) {
      console.error(error);
      setUserListings([]);
    }
  };

  useEffect(() => {
    loadHostListings();
  }, [user]);

  const handleDelete = async (listingId) => {
    setConfirmDeleteId(listingId);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    setDeletingId(confirmDeleteId);
    setErrorMessage('');

    try {
      await deleteListing(confirmDeleteId);
      await loadHostListings();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to delete listing.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    async function loadHostListings() {
      if (!user) {
        setUserListings([]);
        return;
      }

      try {
        const response = await fetchListings();
        const listings = Array.isArray(response?.data) ? response.data : [];
        const filtered = listings.filter((listing) => {
          const hostId = String(listing.host?._id || listing.host || listing.hostId || "");
          return hostId === String(user.id);
        });
        setUserListings(filtered);
      } catch (error) {
        console.error(error);
        setUserListings([]);
      }
    }

    loadHostListings();
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Navbar type="travelling" variant="host-dashboard" />
      <main className="px-8 md:px-16 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Your listing</h1>
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
            {errorMessage ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Welcome, {user.name || user.email}!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userListings.length === 0
                  ? "You don't have any listings yet."
                  : `You have ${userListings.length} listing(s).`}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/host/listings/${listing._id || listing.id}/edit`}
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(listing._id || listing.id)}
                          disabled={deletingId === (listing._id || listing.id)}
                          className="flex-1 rounded-lg bg-[#FF385C] px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
                        >
                          {deletingId === (listing._id || listing.id) ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
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

      {confirmDeleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete listing?</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              This action cannot be undone. The listing will be removed from your host dashboard.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-full bg-[#FF385C] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}