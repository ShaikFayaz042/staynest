import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function HostMessagesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Navbar type="travelling" variant="host-dashboard" />
      <main className="max-w-6xl mx-auto px-8 md:px-16 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Messages</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Inbox placeholder for guest conversations and booking messages.</p>
          </div>
        </div>

        {user ? (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">No messages yet</div>
            <p className="mt-3 text-sm">This is a placeholder page where messaging conversations will appear once implemented.</p>
            <div className="mt-6 text-left text-sm text-gray-500 dark:text-gray-400">
              <p>- Guest booking requests</p>
              <p>- Reservation confirmations</p>
              <p>- Host replies and updates</p>
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl">Please log in to view your messages.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
