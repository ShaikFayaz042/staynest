import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const apiUrl = import.meta.env.VITE_API_URL;

function hasDateOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

export default function BookingCard({ list }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const pricePerNight = list.pricePerNight || 0;
  const maxGuests = list.guests || 1;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 0;
  const total = pricePerNight * nights;

  useEffect(() => {
    const controller = new AbortController();
    const listingId = list._id || list.id;

    async function loadBookings() {
      if (!listingId) {
        setBookings([]);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/bookings?listing=${listingId}`, {
          signal: controller.signal,
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
        setBookings([]);
      }
    }

    loadBookings();
    return () => controller.abort();
  }, [list]);

  const bookedIntervals = useMemo(() => {
    const listingId = String(list._id || list.id || "");
    return bookings
      .filter((b) => {
        const bookingListingId =
          b?.listing?._id || b?.listing?.id || b?.listing || b?.listingId || "";
        return String(bookingListingId) === listingId && b.status !== "cancelled";
      })
      .map((b) => ({
        start: new Date(b.checkIn),
        end: new Date(b.checkOut),
      }));
  }, [bookings, list]);

  const isDateBooked = (date) => {
    return bookedIntervals.some(
      ({ start, end }) => date >= start && date < end
    );
  };

  const conflictingBooking = useMemo(() => {
    if (!checkIn || !checkOut || nights <= 0) return null;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const listingId = String(list._id || list.id || "");

    return (
      bookings.find((booking) => {
        if (
          String(booking.listing || booking.listingId || "") !== listingId ||
          booking.status === "cancelled"
        )
          return false;
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        return (
          bookingStart &&
          bookingEnd &&
          hasDateOverlap(start, end, bookingStart, bookingEnd)
        );
      }) || null
    );
  }, [checkIn, checkOut, list, nights, bookings]);

  const availabilityMessage = useMemo(() => {
    if (!conflictingBooking) return "";
    if (user && String(conflictingBooking.user || conflictingBooking.userId || "") === String(user.id)) {
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

  const handleReserve = async () => {
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
      setMessage(user && String(conflictingBooking.user || conflictingBooking.userId || "") === String(user.id)
        ? `You already have a reservation for ${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}.`
        : `These dates are already reserved for this listing (${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}).`);
      return;
    }

    const listingId = list._id || list.id;
    const payload = {
      listing: listingId,
      checkIn,
      checkOut,
      guests,
      totalPrice: total,
      status: "confirmed",
      paymentStatus: "pending",
      specialRequests: "",
    };

    try {
      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();
      const createdBooking = data?.data;
      if (createdBooking) {
        setBookings((prev) => [...prev, createdBooking]);
      }

      setSuccessMessage("Booking confirmed! Redirecting to your trips...");
      setMessage("");
      setCheckIn("");
      setCheckOut("");
      setGuests(1);

      setTimeout(() => {
        navigate("/trips");
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("Unable to confirm booking. Please try again.");
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <aside className="space-y-4 md:sticky md:top-24">
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

        <div className="mb-3 grid grid-cols-2 rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden">
          <div className="border-r border-gray-300 dark:border-gray-600 p-3">
            <div className="text-[10px] font-bold text-gray-900 dark:text-white">CHECK-IN</div>
            <DatePicker
              selected={checkIn ? new Date(checkIn) : null}
              onChange={(date) =>
                setCheckIn(date ? date.toISOString().split("T")[0] : "")
              }
              selectsStart
              startDate={checkIn ? new Date(checkIn) : null}
              endDate={checkOut ? new Date(checkOut) : null}
              minDate={new Date()}
              filterDate={(date) => !isDateBooked(date)}
              placeholderText="Select date"
              className="w-full text-sm text-gray-700 dark:text-gray-300 outline-none bg-transparent cursor-pointer"
              wrapperClassName="w-full"
              calendarClassName="!rounded-2xl !border !border-gray-200 dark:!border-gray-700 !shadow-lg"
              popperClassName="!z-50"
              dateFormat="dd/MM/yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <div className="p-3">
            <div className="text-[10px] font-bold text-gray-900 dark:text-white">CHECKOUT</div>
            <DatePicker
              selected={checkOut ? new Date(checkOut) : null}
              onChange={(date) =>
                setCheckOut(date ? date.toISOString().split("T")[0] : "")
              }
              selectsEnd
              startDate={checkIn ? new Date(checkIn) : null}
              endDate={checkOut ? new Date(checkOut) : null}
              minDate={
                checkIn
                  ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1))
                  : new Date()
              }
              filterDate={(date) => !isDateBooked(date)}
              placeholderText="Select date"
              className="w-full text-sm text-gray-700 dark:text-gray-300 outline-none bg-transparent cursor-pointer"
              wrapperClassName="w-full"
              calendarClassName="!rounded-2xl !border !border-gray-200 dark:!border-gray-700 !shadow-lg"
              popperClassName="!z-50"
              dateFormat="dd/MM/yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
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

        {(availabilityMessage || message || successMessage) && (
          <div className={`mt-3 text-sm text-center ${successMessage ? "text-green-600 dark:text-green-400" : message?.includes("confirmed") ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {successMessage || message || availabilityMessage}
          </div>
        )}
      </div>
    </aside>
  );
}