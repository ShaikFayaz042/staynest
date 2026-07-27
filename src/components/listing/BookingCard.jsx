import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BookingCard({ list }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pricePerNight = list.pricePerNight || 0;
  const maxGuests = list.guests || 1;

  // State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

  // Calculate nights
  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 0;
  const total = pricePerNight * nights;

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

    // Create booking object
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

    setMessage("Booking confirmed! 🎉");
    setTimeout(() => setMessage(""), 4000);

    // Optionally reset fields
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  };

  return (
    <aside className="sticky top-24 space-y-4">
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-pink-500 text-white">
          <i className="fa-solid fa-tag text-[10px]" />
        </span>
        <span className="text-sm font-medium text-gray-900">Prices include all fees</span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-4">
          <span className="text-lg font-semibold text-gray-900">₹{pricePerNight}</span>
          <span className="text-sm text-gray-700"> / night</span>
        </div>

        {/* Date inputs */}
        <div className="mb-3 grid grid-cols-2 rounded-xl border border-gray-300">
          <div className="border-r border-gray-300 p-3">
            <div className="text-[10px] font-bold text-gray-900">CHECK-IN</div>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none bg-transparent"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="p-3">
            <div className="text-[10px] font-bold text-gray-900">CHECKOUT</div>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none bg-transparent"
              min={checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="mb-4 rounded-xl border border-gray-300 p-3">
          <div className="text-[10px] font-bold text-gray-900">GUESTS</div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>{guests} guest{guests > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGuestChange(-1)}
                disabled={guests <= 1}
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${guests <= 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-400 hover:border-black"}`}
              >
                −
              </button>
              <button
                onClick={() => handleGuestChange(1)}
                disabled={guests >= maxGuests}
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${guests >= maxGuests ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-400 hover:border-black"}`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mb-4 border-t border-gray-200 pt-4 text-sm">
          {nights > 0 ? (
            <>
              <div className="flex justify-between">
                <span>₹{pricePerNight} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between mt-2 font-semibold text-base">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center text-xs">Select dates to see total</p>
          )}
        </div>

        {/* Reserve button */}
        <button
          onClick={handleReserve}
          className="w-full rounded-full bg-linear-to-r from-[#E61E4D] to-[#D70466] py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Reserve
        </button>
        <p className="mt-3 text-center text-sm text-gray-600">You won't be charged yet</p>

        {message && (
          <div className={`mt-3 text-sm text-center ${message.includes("confirmed") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </div>
        )}
      </div>
    </aside>
  );
}