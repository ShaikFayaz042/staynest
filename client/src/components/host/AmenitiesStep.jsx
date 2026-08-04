import { useContext, useState } from "react";
import { HostNavContext } from "./HostNavContext";
import HostFrame from "./HostFrame";

const FALLBACK_AMENITIES = {
  basics: [
    { id: "b1", name: "Air conditioning", icon: "fa-solid fa-snowflake" },
    { id: "b2", name: "Essentials", icon: "fa-solid fa-suitcase-rolling" },
    { id: "b3", name: "Fridge", icon: "fa-solid fa-box" },
    { id: "b4", name: "Heating", icon: "fa-solid fa-temperature-arrow-up" },
    { id: "b5", name: "Hot water", icon: "fa-solid fa-faucet-drip" },
    { id: "b6", name: "Kitchen", icon: "fa-solid fa-kitchen-set" },
    { id: "b7", name: "TV", icon: "fa-solid fa-tv" },
    { id: "b8", name: "Tumble dryer", icon: "fa-solid fa-wind" },
    { id: "b9", name: "Washing machine", icon: "fa-solid fa-shirt" },
    { id: "b10", name: "Wifi", icon: "fa-solid fa-wifi" }
  ],
  popular: [
    { id: "p1", name: "Coffee maker", icon: "fa-solid fa-mug-hot" },
    { id: "p2", name: "Cooking basics", icon: "fa-solid fa-utensils" },
    { id: "p3", name: "Hairdryer", icon: "fa-solid fa-wind" },
    { id: "p4", name: "Hangers", icon: "fa-solid fa-shirt" },
    { id: "p5", name: "Iron", icon: "fa-solid fa-bolt" },
    { id: "p6", name: "Shampoo", icon: "fa-solid fa-bottle-droplet" },
    { id: "p7", name: "Dedicated workspace", icon: "fa-solid fa-laptop" },
    { id: "p8", name: "EV charger", icon: "fa-solid fa-charging-station" },
    { id: "p9", name: "Free parking", icon: "fa-solid fa-square-parking" },
    { id: "p10", name: "Gym", icon: "fa-solid fa-dumbbell" },
    { id: "p11", name: "Hot tub", icon: "fa-solid fa-hot-tub-person" },
    { id: "p12", name: "Indoor fireplace", icon: "fa-solid fa-fire" },
    { id: "p13", name: "Outdoor furniture", icon: "fa-solid fa-chair" },
    { id: "p14", name: "Pool", icon: "fa-solid fa-water-ladder" }
  ],
  location: [
    { id: "l1", name: "Beach access", icon: "fa-solid fa-umbrella-beach" },
    { id: "l2", name: "Waterfront", icon: "fa-solid fa-water" },
    { id: "l3", name: "Mountain view", icon: "fa-solid fa-mountain" },
    { id: "l4", name: "City view", icon: "fa-solid fa-city" },
    { id: "l5", name: "Garden view", icon: "fa-solid fa-leaf" }
  ],
  safety: [
    { id: "s1", name: "Carbon monoxide alarm", icon: "fa-solid fa-cloud" },
    { id: "s2", name: "Smoke alarm", icon: "fa-solid fa-bell" },
    { id: "s3", name: "First aid kit", icon: "fa-solid fa-kit-medical" },
    { id: "s4", name: "Fire extinguisher", icon: "fa-solid fa-fire-extinguisher" },
    { id: "s5", name: "Security cameras", icon: "fa-solid fa-video" }
  ]
};

const getInitialAmenities = () => {
  try {
    const raw = localStorage.getItem("amenities");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    console.warn("Failed to parse amenities from localStorage", e);
  }
  return FALLBACK_AMENITIES;
};

const CATEGORY_LABELS = {
  basics: "Basics",
  popular: "Popular",
  location: "Location",
  safety: "Safety",
};

export default function AmenitiesStep() {
  const { formData, setFormData } = useContext(HostNavContext);
  const [amenities] = useState(getInitialAmenities);
  const selectedIds = formData.amenities || [];

  const toggleAmenity = (id) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    setFormData({ ...formData, amenities: updated });
  };

  // Check if at least 4 are selected
  const isEnough = selectedIds.length >= 4;

  return (
    <HostFrame progress={[1, 0.2, 0]} nextDisabled={false}>
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Tell guests what your place has to offer
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          You can add more amenities after you publish your listing.
        </p>

        {/* Selection status with validation */}
        <div className="mt-2 flex items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Selected: <span className="font-semibold">{selectedIds.length}</span> amenities
          </p>
          {!isEnough && (
            <span className="text-sm text-red-500 dark:text-red-400 font-medium">
              (Need at least 4)
            </span>
          )}
          {isEnough && (
            <span className="text-sm text-[#FF385C] font-medium">
              ✓ Good to go
            </span>
          )}
        </div>

        {/* Amenities grid */}
        {Object.keys(CATEGORY_LABELS).map((categoryKey) => {
          const items = amenities[categoryKey] || [];
          if (!items.length) return null;
          return (
            <div key={categoryKey} className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                {CATEGORY_LABELS[categoryKey]}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {items.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selected
                          ? "border-[#FF385C] border-2 bg-rose-50 dark:bg-gray-800 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900"
                      }`}
                    >
                      <i className={`${item.icon} text-xl text-gray-700 dark:text-gray-200`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                      {selected && (
                        <span className="ml-auto text-[#FF385C]">
                          <i className="fa-solid fa-check" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </HostFrame>
  );
}