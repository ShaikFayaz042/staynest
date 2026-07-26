import HostFrame from "./HostFrame";

function Counter({ label, value = 0 }) {
  return (
    <div className="flex items-center justify-between py-6 border-b border-gray-200">
      <div className="text-lg">{label}</div>
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-black">−</button>
        <span className="w-6 text-center">{value}</span>
        <button className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-black">+</button>
      </div>
    </div>
  );
}

export default function BasicsStep() {
  return (
    <HostFrame progress={[0.7, 0, 0]}>
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Share some basics about your place</h1>
        <p className="mt-3 text-gray-600">You'll add more details later, like bed types.</p>
        <div className="mt-8">
          <Counter label="Guests" value={4} />
          <Counter label="Bedrooms" value={2} />
          <Counter label="Beds" value={2} />
          <Counter label="Bathrooms" value={1} />
        </div>
        <div className="mt-10">
          <h3 className="font-semibold text-lg">Does every bedroom have a lock?</h3>
          <div className="mt-4 space-y-3">
            {["Yes", "No"].map((opt, i) => (
              <label key={opt} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer">
                <span>{opt}</span>
                <input type="radio" name="lock" defaultChecked={i === 0} className="w-5 h-5 accent-black" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </HostFrame>
  );
}
