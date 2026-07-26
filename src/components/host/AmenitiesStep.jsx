import HostFrame from "./HostFrame";

const AMENITIES = [
  { icon: "fa-wifi", label: "Wifi" },
  { icon: "fa-tv", label: "TV" },
  { icon: "fa-utensils", label: "Kitchen" },
  { icon: "fa-soap", label: "Washing machine" },
  { icon: "fa-square-parking", label: "Free parking" },
  { icon: "fa-snowflake", label: "Air conditioning" },
  { icon: "fa-briefcase", label: "Dedicated workspace" },
  { icon: "fa-water-ladder", label: "Pool" },
  { icon: "fa-hot-tub-person", label: "Hot tub" },
  { icon: "fa-fire", label: "Patio" },
  { icon: "fa-dumbbell", label: "Gym equipment" },
  { icon: "fa-tree", label: "BBQ grill" },
];

export default function AmenitiesStep() {
  return (
    <HostFrame progress={[1, 0.2, 0]}>
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Tell guests what your place has to offer</h1>
        <p className="mt-3 text-gray-600">You can add more amenities after you publish your listing.</p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {AMENITIES.map((a, i) => (
            <button
              key={a.label}
              className={`text-left p-5 rounded-xl border ${i < 3 ? "border-black border-2 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
            >
              <i className={`fa-solid ${a.icon} text-2xl text-gray-800`} />
              <div className="mt-4 font-semibold">{a.label}</div>
            </button>
          ))}
        </div>
      </div>
    </HostFrame>
  );
}
