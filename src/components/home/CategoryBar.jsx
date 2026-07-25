import { useState } from "react";

const categories = [
  { label: "Beach", icon: "fa-solid fa-umbrella-beach" },
  { label: "Windmills", icon: "fa-solid fa-wind" },
  { label: "Modern", icon: "fa-solid fa-building" },
  { label: "Countryside", icon: "fa-solid fa-mountain" },
  { label: "Pools", icon: "fa-solid fa-water" },
  { label: "Islands", icon: "fa-solid fa-tree" },
  { label: "Lake", icon: "fa-solid fa-ship" },
  { label: "Skiing", icon: "fa-solid fa-skiing" },
  { label: "Castles", icon: "fab fa-fort-awesome" },

  { label: "Caves", icon: "fa-solid fa-mountain-sun" },
  { label: "Camping", icon: "fa-solid fa-campground" },
  { label: "Arctic", icon: "fa-solid fa-snowflake" },
  { label: "Desert", icon: "fa-solid fa-sun" },
  { label: "Barns", icon: "fa-solid fa-warehouse" },

  { label: "Lux", icon: "fa-solid fa-gem" },
];

export default function CategoryBar() {
  const [active, setActive] = useState("Beach");

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto py-4 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const isActive = active === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActive(cat.label)}
                className={`flex flex-col items-center gap-2 min-w-16 pb-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  isActive
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <i className={`${cat.icon} text-base`} aria-hidden="true" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}