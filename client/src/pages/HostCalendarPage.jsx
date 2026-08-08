import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function HostDashboardPage() {
  const { user } = useAuth();
  const [hostBookings, setHostBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const bookingMap = hostBookings.reduce((map, booking) => {
    const startDate = new Date(booking.checkIn);
    const endDate = new Date(booking.checkOut);
    for (let current = new Date(startDate); current < endDate; current.setDate(current.getDate() + 1)) {
      const key = current.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(booking);
    }
    return map;
  }, {});

  const slideMonths = Array.from({ length: 3 }, (_, offset) => {
    const date = new Date(viewYear, viewMonth + offset, 1);
    return { month: date.getMonth(), year: date.getFullYear() };
  });

  const totalEarnings = hostBookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
  const totalBookings = hostBookings.length;
  const upcomingBookings = hostBookings.filter((booking) => new Date(booking.checkIn) >= new Date()).length;
  const totalNights = hostBookings.reduce((sum, booking) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.max(0, Math.round((checkOut - checkIn) / 86400000));
    return sum + nights;
  }, 0);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const renderCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];

    return (
      <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{MONTH_NAMES[month]} {year}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{hostBookings.length > 0 ? `${hostBookings.length} booking${hostBookings.length > 1 ? 's' : ''}` : 'No bookings this month yet'}</div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
          {WEEKDAYS.map((weekday) => (
            <div key={`${month}-${weekday}`} className="py-1">{weekday}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            const dateKey = date ? date.toISOString().slice(0, 10) : null;
            const bookingsOnDate = dateKey ? bookingMap[dateKey] : null;
            const isPast = date && date < new Date(new Date().setHours(0, 0, 0, 0));
            const isBooked = !!bookingsOnDate;
            return (
              <div key={`${month}-${index}`} className="aspect-square rounded-2xl bg-white dark:bg-gray-800">
                {date ? (
                  <button
                    type="button"
                    disabled={isBooked || isPast}
                    title={bookingsOnDate ? bookingsOnDate.map((booking) => `${booking.guest?.name || 'Guest'} • ${booking.listing?.title || 'Listing'}`).join('\n') : ''}
                    className={`w-full h-full rounded-2xl p-2 text-left transition ${isBooked ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'} ${isPast && !isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-semibold">{date.getDate()}</span>
                    {isBooked ? (
                      <span className="mt-2 inline-flex rounded-full bg-gray-500 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">Booked</span>
                    ) : null}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const allListings = JSON.parse(localStorage.getItem('listings')) || [];
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const hostListings = allListings.filter((listing) => String(listing.hostId || listing.host) === String(user?.id));
    const hostListingIds = hostListings.map((listing) => listing.id || listing._id);
    const filteredBookings = bookings
      .filter((booking) => hostListingIds.includes(booking.listingId))
      .map((booking) => ({
        ...booking,
        listing: hostListings.find((listing) => listing.id === booking.listingId || listing._id === booking.listingId),
        guest: allUsers.find((userData) => userData.id === booking.userId || userData._id === booking.userId),
      }))
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

    setHostBookings(filteredBookings);
    setListings(hostListings);
    setUsers(allUsers);
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Navbar type="travelling" variant="host-dashboard" />
      <main className="max-w-6xl mx-auto px-8 md:px-16 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Host Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Track your earnings, bookings, and availability in one place.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Kitna paisa kamaya</div>
            <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">₹{totalEarnings.toLocaleString()}</div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total earned from completed bookings</div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Bookings</div>
            <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{totalBookings}</div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total reservations across all listings</div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Upcoming stays</div>
            <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{upcomingBookings}</div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Future bookings awaiting arrival</div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Active listings</div>
            <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{listings.length}</div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Listings currently on your dashboard</div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking calendar</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Scroll through upcoming months and see booked dates for your listings.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>

          <div ref={calendarTrackRef} className="mt-6 overflow-x-auto pb-3">
            <div className="flex gap-4 snap-x snap-mandatory scroll-smooth">
              {slideMonths.map((monthData) => (
                <div key={`${monthData.year}-${monthData.month}`} className="snap-center min-w-[320px] flex-shrink-0">
                  {renderCalendar(monthData.month, monthData.year)}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
              Booked
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              Available
            </div>
          </div>
        </div>

        {user ? (
          hostBookings.length > 0 ? (
            <div className="mt-8 space-y-4">
              {hostBookings.map((booking) => (
                <div key={booking.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{booking.listing?.title || 'Unknown listing'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.listing?.location?.city || 'Unknown city'} · {booking.listing?.category || 'Unknown'}</div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-white">{new Date(booking.checkIn).toLocaleDateString()}</span>
                      <span className="mx-2">→</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Guest</div>
                      <div className="mt-1 font-semibold text-gray-900 dark:text-white">{booking.guest?.name || 'Unknown guest'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.guest?.email || 'No email'}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Guests</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{booking.guests}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white capitalize">{booking.status || 'Confirmed'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <p className="text-xl font-semibold">No bookings yet.</p>
              <p className="mt-2">Your calendar will show booked dates once guests reserve your listings.</p>
            </div>
          )
        ) : (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl">Please log in to view your host calendar.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
