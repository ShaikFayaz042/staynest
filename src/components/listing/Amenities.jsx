const AMENITIES = [
  { icon: "fa-umbrella-beach", label: "Resort view" },
  { icon: "fa-water", label: "Canal view" },
  { icon: "fa-person-swimming", label: "Beach access" },
  { icon: "fa-utensils", label: "Kitchen" },
  { icon: "fa-wifi", label: "Wifi" },
  { icon: "fa-briefcase", label: "Dedicated workspace" },
  { icon: "fa-car", label: "Free parking on premises" },
  { icon: "fa-video", label: "Exterior security cameras on property" },
  { icon: "fa-triangle-exclamation", label: "Carbon monoxide alarm", strike: true },
  { icon: "fa-bell-slash", label: "Smoke alarm", strike: true },
];

export default function Amenities() {
  return (
    <section className="border-b border-gray-200 py-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">What this place offers</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {AMENITIES.map((a) => (
          <div key={a.label} className="flex items-center gap-3 text-sm text-gray-800">
            <i className={`fa-solid ${a.icon} w-5 text-gray-700`} />
            <span className={a.strike ? "line-through text-gray-500" : ""}>{a.label}</span>
          </div>
        ))}
      </div>
      <button className="mt-6 rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900">
        Show all 76 amenities
      </button>
    </section>
  );
}
