import HostFrame from "./HostFrame";

const TYPES = [
  { icon: "fa-house", label: "House" },
  { icon: "fa-building", label: "Flat" },
  { icon: "fa-warehouse", label: "Barn" },
  { icon: "fa-bed", label: "Bed & breakfast" },
  { icon: "fa-tree", label: "Cabin" },
  { icon: "fa-campground", label: "Campsite" },
  { icon: "fa-caravan", label: "Camper/RV" },
  { icon: "fa-hotel", label: "Casa particular" },
  { icon: "fa-castle", label: "Castle" },
  { icon: "fa-mountain", label: "Cave" },
  { icon: "fa-water", label: "Container" },
  { icon: "fa-igloo", label: "Cycladic home" },
];

export default function PropertyTypeStep() {
  return (
    <HostFrame progress={[0.3, 0, 0]}>
      <div className="max-w-5xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Which of these best describes your place?</h1>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {TYPES.map((t, i) => (
            <button
              key={t.label}
              className={`text-left p-5 rounded-xl border ${i === 0 ? "border-black border-2 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
            >
              <i className={`fa-solid ${t.icon} text-2xl text-gray-800`} />
              <div className="mt-6 font-semibold">{t.label}</div>
            </button>
          ))}
        </div>
      </div>
    </HostFrame>
  );
}
