import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function parseDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function hasDateOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

export default function BookingCard({ list }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pricePerNight = list.pricePerNight || 0;
  const maxGuests = list.guests || 1;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 0;
  const total = pricePerNight * nights;

  const conflictingBooking = useMemo(() => {
    if (!checkIn || !checkOut || nights <= 0) return null;

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const start = parseDate(checkIn);
    const end = parseDate(checkOut);

    return bookings.find((booking) => {
      if (booking.listingId !== list.id || booking.status === "cancelled") return false;
      const bookingStart = parseDate(booking.checkIn);
      const bookingEnd = parseDate(booking.checkOut);
      return bookingStart && bookingEnd && hasDateOverlap(start, end, bookingStart, bookingEnd);
    }) || null;
  }, [checkIn, checkOut, list.id, nights]);

  const availabilityMessage = useMemo(() => {
    if (!conflictingBooking) return "";
    if (user && conflictingBooking.userId === user.id) {
      return `You already have a reservation for ${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}.`;
    }
    return `These dates are already reserved for this listing (${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}).`;
  }, [conflictingBooking, user]);

  const handleGuestChange = (delta) => {
    const newVal = guests + delta;
    if (newVal >= 1 && newVal <= maxGuests) {
      setGuests(newVal);
    }
  };

  const handleReserve = () => {
    if (!user) {
      setMessage("Please log in to book this listing.");
      setTimeout(() => setMessage(""), 4000);
      return;
    }
    if (!checkIn || !checkOut) {
      setMessage("Please select check-in and check-out dates.");
      return;
    }
    if (nights <= 0) {
      setMessage("Check-out must be after check-in.");
      return;
    }

    if (conflictingBooking) {
      setMessage(user && conflictingBooking.userId === user.id
        ? `You already have a reservation for ${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}.`
        : `These dates are already reserved for this listing (${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}).`);
      return;
    }

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const maxId = bookings.reduce((max, b) => {
      const num = parseInt(b.id.replace("bk", ""));
      return num > max ? num : max;
    }, 0);
    const newBooking = {
      id: `bk${maxId + 1}`,
      userId: user.id,
      listingId: list.id,
      checkIn,
      checkOut,
      guests,
      totalPrice: total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    const listings = JSON.parse(localStorage.getItem("listings")) || [];
    const listingIndex = listings.findIndex((listing) => listing.id === list.id);
    if (listingIndex !== -1) {
      listings[listingIndex] = {
        ...listings[listingIndex],
        bookingIds: [...(listings[listingIndex].bookingIds || []), newBooking.id],
      };
      localStorage.setItem("listings", JSON.stringify(listings));
    }

    setMessage("Booking confirmed! 🎉");
    setTimeout(() => setMessage(""), 4000);
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  };

  return (
    <aside className="sticky top-24 space-y-4">
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-pink-500 text-white">
          <i className="fa-solid fa-tag text-[10px]" />
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">Prices include all fees</span>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md">
        <div className="mb-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">₹{pricePerNight}</span>
          <span className="text-sm text-gray-700 dark:text-gray-400"> / night</span>
        </div>

        <div className="mb-3 grid grid-cols-2 rounded-xl border border-gray-300 dark:border-gray-600">
          <div className="border-r border-gray-300 dark:border-gray-600 p-3">
            <div className="text-[10px] font-bold text-gray-900 dark:text-white">CHECK-IN</div>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              // Added dark:[color-scheme:dark] and cursor-pointer
              className="w-full text-sm text-gray-700 dark:text-gray-300 outline-none bg-transparent cursor-pointer dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="p-3">
            <div className="text-[10px] font-bold text-gray-900 dark:text-white">CHECKOUT</div>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              // Added dark:[color-scheme:dark] and cursor-pointer
              className="w-full text-sm text-gray-700 dark:text-gray-300 outline-none bg-transparent cursor-pointer dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              min={checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-gray-300 dark:border-gray-600 p-3">
          <div className="text-[10px] font-bold text-gray-900 dark:text-white">GUESTS</div>
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>{guests} guest{guests > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGuestChange(-1)}
                disabled={guests <= 1}
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  guests <= 1
                    ? "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "border-gray-400 dark:border-gray-500 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-300"
                }`}
              >
                −
              </button>
              <button
                onClick={() => handleGuestChange(1)}
                disabled={guests >= maxGuests}
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  guests >= maxGuests
                    ? "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "border-gray-400 dark:border-gray-500 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-300"
                }`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm">
          {nights > 0 ? (
            <>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>₹{pricePerNight} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between mt-2 font-semibold text-base text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center text-xs">Select dates to see total</p>
          )}
        </div>

        <button
          onClick={handleReserve}
          disabled={Boolean(availabilityMessage)}
          className={`w-full rounded-full bg-linear-to-r from-[#E61E4D] to-[#D70466] py-3 text-base font-semibold text-white transition-opacity ${availabilityMessage ? "cursor-not-allowed opacity-70" : "hover:opacity-90"}`}
        >
          {availabilityMessage ? "Unavailable" : "Reserve"}
        </button>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">You won't be charged yet</p>

        {(availabilityMessage || message) && (
          <div className={`mt-3 text-sm text-center ${message?.includes("confirmed") ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {message || availabilityMessage}
          </div>
        )}
      </div>
    </aside>
  );
}