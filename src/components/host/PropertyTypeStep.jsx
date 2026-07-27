import { useContext, useState } from "react";
import { HostNavContext } from "./HostNavContext";
import HostFrame from "./HostFrame";

const FALLBACK_CATEGORIES = [
  { icon: "fa-house", name: "House" },
  { icon: "fa-building", name: "Flat" },
  { icon: "fa-warehouse", name: "Barn" },
  { icon: "fa-bed", name: "Bed & breakfast" },
  { icon: "fa-tree", name: "Cabin" },
  { icon: "fa-campground", name: "Campsite" },
  { icon: "fa-caravan", name: "Camper/RV" },
  { icon: "fa-hotel", name: "Casa particular" },
  { icon: "fa-castle", name: "Castle" },
  { icon: "fa-mountain", name: "Cave" },
  { icon: "fa-water", name: "Container" },
  { icon: "fa-igloo", name: "Cycladic home" },
];

const getInitialCategories = () => {
  try {
    const raw = localStorage.getItem("categories");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.length) return parsed;
    }
  } catch (e) {
    console.warn("Failed to parse categories from localStorage", e);
  }
  return FALLBACK_CATEGORIES;
};

export default function PropertyTypeStep() {
  const { formData, setFormData } = useContext(HostNavContext);
  const [categories] = useState(getInitialCategories);

  const selected = formData.category || null;
  const isValid = !!selected;

  const handleSelect = (name) => {
    setFormData({ ...formData, category: name });
  };

  return (
    <HostFrame progress={[0.3, 0, 0]} nextDisabled={!isValid}>
      <div className="max-w-5xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Which of these best describes your place?
        </h1>
        <p className="mt-3 text-gray-600">
          Select the category that best matches your property.
        </p>

        <div className="mt-6 text-sm text-gray-500">
          {selected ? (
            <span>
              Selected: <span className="font-semibold text-gray-900">{selected}</span>
            </span>
          ) : (
            <span>Please select a category to continue</span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const isSelected = selected === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleSelect(cat.name)}
                className={`relative text-left p-5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-black border-2 bg-gray-50 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-2xl text-gray-800`} />
                <div className="mt-6 font-semibold">{cat.name}</div>
                {isSelected && (
                  <span className="absolute top-3 right-3 text-green-600">
                    <i className="fa-solid fa-check" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </HostFrame>
  );
}