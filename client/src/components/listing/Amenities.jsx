const AMENITY_ICONS = {
  "Air conditioning": "fa-snowflake",
  "Essentials": "fa-suitcase-rolling",
  "Fridge": "fa-box",
  "Heating": "fa-temperature-arrow-up",
  "Hot water": "fa-faucet-drip",
  "Kitchen": "fa-kitchen-set",
  "TV": "fa-tv",
  "Tumble dryer": "fa-wind",
  "Washing machine": "fa-shirt",
  "Wifi": "fa-wifi",
  "Coffee maker": "fa-mug-hot",
  "Cooking basics": "fa-utensils",
  "Hairdryer": "fa-wind",
  "Hangers": "fa-shirt",
  "Iron": "fa-bolt",
  "Shampoo": "fa-bottle-droplet",
  "Dedicated workspace": "fa-laptop",
  "EV charger": "fa-charging-station",
  "Free parking": "fa-square-parking",
  "Gym": "fa-dumbbell",
  "Hot tub": "fa-hot-tub-person",
  "Indoor fireplace": "fa-fire",
  "Outdoor furniture": "fa-chair",
  "Pool": "fa-water-ladder",
  "Beach access": "fa-umbrella-beach",
  "Waterfront": "fa-water",
  "Mountain view": "fa-mountain",
  "City view": "fa-city",
  "Garden view": "fa-leaf",
  "Carbon monoxide alarm": "fa-cloud",
  "Smoke alarm": "fa-bell",
  "First aid kit": "fa-kit-medical",
  "Fire extinguisher": "fa-fire-extinguisher",
  "Security cameras": "fa-video",
};

export default function Amenities({ list }) {
  const offers = Array.isArray(list) ? list : [];

  return (
    <section className="border-b border-gray-700 py-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">What this place offers</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {offers.map((name) => (
          <div key={name} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <i className={`fa-solid ${AMENITY_ICONS[name] || "fa-circle"} w-5`} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
