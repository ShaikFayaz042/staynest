import { useState, useEffect, useRef } from "react";

// Inline categories (previously in client/src/data/categories.js)
const categories = [
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

// Inline amenities (previously in client/src/data/amenities.js)
const amenities = {
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
    { id: "b10", name: "Wifi", icon: "fa-solid fa-wifi" },
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
    { id: "p14", name: "Pool", icon: "fa-solid fa-water-ladder" },
  ],
  location: [
    { id: "l1", name: "Beach access", icon: "fa-solid fa-umbrella-beach" },
    { id: "l2", name: "Waterfront", icon: "fa-solid fa-water" },
    { id: "l3", name: "Mountain view", icon: "fa-solid fa-mountain" },
    { id: "l4", name: "City view", icon: "fa-solid fa-city" },
    { id: "l5", name: "Garden view", icon: "fa-solid fa-leaf" },
  ],
  safety: [
    { id: "s1", name: "Carbon monoxide alarm", icon: "fa-solid fa-cloud" },
    { id: "s2", name: "Smoke alarm", icon: "fa-solid fa-bell" },
    { id: "s3", name: "First aid kit", icon: "fa-solid fa-kit-medical" },
    { id: "s4", name: "Fire extinguisher", icon: "fa-solid fa-fire-extinguisher" },
    { id: "s5", name: "Security cameras", icon: "fa-solid fa-video" },
  ],
};

export const defaultFilters = {
  propertyType: "",
  priceRange: "",
  minRating: 0,
  guestFavourite: false,
  amenities: [],
  bedrooms: "",
  beds: "",
  bathrooms: "",
  sort: "recommended",
};

// ─── Data ────────────────────────────────────────────────────

const propertyTypes = categories.map((cat) => ({
  key: cat.name.toLowerCase().replace(/\s+/g, "-"),
  label: cat.name,
  icon: cat.icon,
  value: cat.name,
}));

const allAmenities = Object.values(amenities).flat();
const amenityOptions = allAmenities.map((item) => ({
  label: item.name,
  value: item.name,
  icon: item.icon,
}));

const priceOptions = [
  { key: "any", label: "Any price", value: "" },
  { key: "budget", label: "₹1k – ₹3k", value: "0-3000" },
  { key: "mid", label: "₹3k – ₹6k", value: "3000-6000" },
  { key: "premium", label: "₹6k – ₹10k", value: "6000-10000" },
  { key: "luxury", label: "₹10k+", value: "10000+" },
];

const ratingOptions = [
  { key: "any", label: "Any rating", value: 0 },
  { key: "4", label: "4.0+", value: 4 },
  { key: "4.5", label: "4.5+", value: 4.5 },
  { key: "4.8", label: "4.8+", value: 4.8 },
];

const bedroomOptions = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];

const bedOptions = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];

const bathroomOptions = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
];

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Price ↑", value: "price-low" },
  { label: "Price ↓", value: "price-high" },
  { label: "Highest rated", value: "highest-rated" },
  { label: "Newest", value: "newest" },
];

// ─── Helpers ──────────────────────────────────────────────────

function getPriceLabel(range) {
  return priceOptions.find((o) => o.value === range)?.label ?? "Any price";
}

function getRatingLabel(value) {
  return ratingOptions.find((o) => o.value === value)?.label ?? "Any rating";
}

function getPropertyLabel(value) {
  return propertyTypes.find((p) => p.value === value)?.label ?? "Property";
}

function getAmenitiesLabel(selected) {
  if (!selected.length) return "Amenities";
  if (selected.length === 1) return selected[0];
  return `${selected.length} amenities`;
}

function getBedroomsLabel(val) {
  return val ? `${val}+ beds` : "Bedrooms";
}

function getBedsLabel(val) {
  return val ? `${val}+ beds` : "Beds";
}

function getBathroomsLabel(val) {
  return val ? `${val}+ baths` : "Bathrooms";
}

function getSortLabel(val) {
  return sortOptions.find((o) => o.value === val)?.label ?? "Sort";
}

function getActiveFilterCount(filters) {
  let count = 0;
  if (filters.propertyType) count += 1;
  if (filters.priceRange) count += 1;
  if (filters.minRating > 0) count += 1;
  if (filters.guestFavourite) count += 1;
  if (filters.amenities.length) count += 1;
  if (filters.bedrooms) count += 1;
  if (filters.beds) count += 1;
  if (filters.bathrooms) count += 1;
  if (filters.sort !== "recommended") count += 1;
  return count;
}

// ─── Reusable Category Button ──────────────────────────────

function FilterCategoryButton({ label, value, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "border-gray-900 bg-gray-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-gray-900"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      <span>{label}</span>
      <span className="text-xs opacity-70">{value}</span>
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────

function FilterModal({ isOpen, onClose, filters, setDraft, onApply, onReset, activeSection }) {
  const modalRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Scroll to active section when modal opens
  useEffect(() => {
    if (isOpen && activeSection && sectionRefs.current[activeSection]) {
      setTimeout(() => {
        sectionRefs.current[activeSection]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [isOpen, activeSection]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div className="absolute inset-x-0 top-full z-[70] mt-2 flex justify-center px-2 py-2 sm:px-3">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter properties"
        className="relative z-[70] w-full max-w-2xl max-h-[72vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Refine your stay with a few focused options.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Close filters"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-4 py-4">
          {/* Property Type */}
          <section ref={(el) => (sectionRefs.current["property"] = el)}>
            <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Property Type</div>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((p) => (
                <FilterChip
                  key={p.key}
                  active={filters.propertyType === p.value}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      propertyType: prev.propertyType === p.value ? "" : p.value,
                    }))
                  }
                >
                  <i className={`fa-solid ${p.icon}`} />
                  {p.label}
                </FilterChip>
              ))}
            </div>
          </section>

          {/* Price */}
          <section ref={(el) => (sectionRefs.current["price"] = el)}>
            <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Price</div>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map((o) => (
                <FilterChip
                  key={o.key}
                  active={filters.priceRange === o.value}
                  onClick={() => setDraft((prev) => ({ ...prev, priceRange: o.value }))}
                >
                  {o.label}
                </FilterChip>
              ))}
            </div>
          </section>

          {/* Rating */}
          <section ref={(el) => (sectionRefs.current["rating"] = el)}>
            <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Rating</div>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((o) => (
                <FilterChip
                  key={o.key}
                  active={filters.minRating === o.value}
                  onClick={() => setDraft((prev) => ({ ...prev, minRating: o.value }))}
                >
                  {o.label}
                </FilterChip>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section ref={(el) => (sectionRefs.current["amenities"] = el)}>
            <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Amenities</div>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((a) => (
                <FilterChip
                  key={a.value}
                  active={filters.amenities.includes(a.value)}
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      amenities: prev.amenities.includes(a.value)
                        ? prev.amenities.filter((item) => item !== a.value)
                        : [...prev.amenities, a.value],
                    }));
                  }}
                >
                  {a.label}
                </FilterChip>
              ))}
            </div>
          </section>

          {/* Bedrooms, Beds, Bathrooms */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Bedrooms", options: bedroomOptions, key: "bedrooms", ref: "bedrooms" },
              { label: "Beds", options: bedOptions, key: "beds", ref: "beds" },
              { label: "Bathrooms", options: bathroomOptions, key: "bathrooms", ref: "bathrooms" },
            ].map(({ label, options, key, ref }) => (
              <section key={key} ref={(el) => (sectionRefs.current[ref] = el)}>
                <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{label}</div>
                <div className="flex flex-wrap gap-2">
                  {options.map((o) => (
                    <FilterChip
                      key={o.value || `any-${key}`}
                      active={filters[key] === o.value}
                      onClick={() => setDraft((prev) => ({ ...prev, [key]: o.value }))}
                    >
                      {o.label}
                    </FilterChip>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Preferences */}
          <section ref={(el) => (sectionRefs.current["sort"] = el)}>
            <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Preferences</div>
            <div className="flex flex-wrap items-center gap-3">
              <FilterChip
                active={filters.guestFavourite}
                onClick={() => setDraft((prev) => ({ ...prev, guestFavourite: !prev.guestFavourite }))}
              >
                {filters.guestFavourite ? "✓" : "○"} Guest Favourite
              </FilterChip>
              <select
                value={filters.sort}
                onChange={(e) => setDraft((prev) => ({ ...prev, sort: e.target.value }))}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Chip (for modal) ──────────────────────────────

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "border-gray-900 bg-gray-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-gray-900"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────

// ─── Main Component ──────────────────────────────────────────

export default function FilterBar({ onFiltersChange }) {
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const applyFilters = (nextFilters) => {
    setDraftFilters(nextFilters);
    setAppliedFilters(nextFilters);
    onFiltersChange?.(nextFilters);
  };

  const resetFilters = () => {
    applyFilters(defaultFilters);
    setIsModalOpen(false);
  };

  const openModalWithSection = (section) => {
    setActiveSection(section);
    setIsModalOpen(true);
  };

  const quickFilterCount = getActiveFilterCount(appliedFilters);

  return (
    <div className="relative z-60 w-full border-b border-gray-200 bg-white/95 dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-[1680px] items-center gap-2 overflow-x-auto overflow-visible px-4 py-3 sm:px-6 lg:px-8 xl:px-10 scrollbar-none">
        <div className="flex w-full items-center gap-2 sm:hidden">
          <FilterCategoryButton
            label="Property"
            value={getPropertyLabel(appliedFilters.propertyType)}
            active={!!appliedFilters.propertyType}
            onClick={() => openModalWithSection("property")}
          />

          <FilterCategoryButton
            label="Price"
            value={getPriceLabel(appliedFilters.priceRange)}
            active={!!appliedFilters.priceRange}
            onClick={() => openModalWithSection("price")}
          />

          <button
            onClick={() => openModalWithSection(null)}
            className="ml-auto flex shrink-0 items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <i className="fa-solid fa-sliders" />
            <span>Filters</span>
            {quickFilterCount > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-gray-900 dark:bg-gray-900 dark:text-white">
                {quickFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="hidden w-full items-center gap-2 sm:flex">
          {/* Property */}
          <FilterCategoryButton
            label="Property"
            value={getPropertyLabel(appliedFilters.propertyType)}
            active={!!appliedFilters.propertyType}
            onClick={() => openModalWithSection("property")}
          />

          {/* Price */}
          <FilterCategoryButton
            label="Price"
            value={getPriceLabel(appliedFilters.priceRange)}
            active={!!appliedFilters.priceRange}
            onClick={() => openModalWithSection("price")}
          />

          {/* Rating */}
          <FilterCategoryButton
            label="Rating"
            value={getRatingLabel(appliedFilters.minRating)}
            active={appliedFilters.minRating > 0}
            onClick={() => openModalWithSection("rating")}
          />

          {/* Amenities */}
          <FilterCategoryButton
            label="Amenities"
            value={getAmenitiesLabel(appliedFilters.amenities)}
            active={appliedFilters.amenities.length > 0}
            onClick={() => openModalWithSection("amenities")}
          />

          {/* Sort */}
          <FilterCategoryButton
            label="Sort"
            value={getSortLabel(appliedFilters.sort)}
            active={appliedFilters.sort !== "recommended"}
            onClick={() => openModalWithSection("sort")}
          />

          {/* Guest Favourite toggle */}
          <button
            onClick={() => {
              const next = {
                ...appliedFilters,
                guestFavourite: !appliedFilters.guestFavourite,
              };
              applyFilters(next);
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              appliedFilters.guestFavourite
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {appliedFilters.guestFavourite ? "♥" : "♡"} Guest Favourite
          </button>

          {/* Filters icon – rightmost */}
          <button
            onClick={() => openModalWithSection(null)}
            className="ml-auto flex shrink-0 items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <i className="fa-solid fa-sliders" />
            <span>Filters</span>
            {quickFilterCount > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-gray-900 dark:bg-gray-900 dark:text-white">
                {quickFilterCount}
              </span>
            )}
          </button>

          {/* Clear all */}
          {quickFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="shrink-0 text-sm font-medium text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Modal – unchanged, still contains all sections including bedrooms, beds, bathrooms */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={draftFilters}
        setDraft={setDraftFilters}
        onApply={() => {
          setAppliedFilters(draftFilters);
          onFiltersChange?.(draftFilters);
          setIsModalOpen(false);
        }}
        onReset={resetFilters}
        activeSection={activeSection}
      />
    </div>
  );
}