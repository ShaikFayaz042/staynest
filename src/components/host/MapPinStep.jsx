import HostFrame from "./HostFrame";

export default function MapPinStep() {
  return (
    <HostFrame progress={[0.5, 0, 0]}>
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Is the pin in the right spot?</h1>
        <p className="mt-3 text-gray-600">Your address is only shared with guests after they've made a reservation.</p>
        <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 relative">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
            alt="Map"
            className="w-full h-105 object-cover"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <div className="w-10 h-10 rounded-full bg-[#FF385C] border-4 border-white shadow-lg flex items-center justify-center">
              <i className="fa-solid fa-house text-white text-sm" />
            </div>
          </div>
        </div>
      </div>
    </HostFrame>
  );
}
