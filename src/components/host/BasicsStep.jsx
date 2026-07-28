import { useContext } from "react";
import { HostNavContext } from "./HostNavContext";
import HostFrame from "./HostFrame";

function Counter({ label, value = 0, onChange, min = 0, max = 20 }) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between py-6 border-b border-gray-200 dark:border-gray-800">
      <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{label}</div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className={`w-8 h-8 rounded-full border ${
            value <= min
              ? "border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#FF385C] dark:hover:border-[#FF385C]"
          } flex items-center justify-center`}
        >
          −
        </button>
        <span className="w-6 text-center text-lg font-semibold text-gray-900 dark:text-white">{value}</span>
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className={`w-8 h-8 rounded-full border ${
            value >= max
              ? "border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#FF385C] dark:hover:border-[#FF385C]"
          } flex items-center justify-center`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function BasicsStep() {
  const { formData, setFormData } = useContext(HostNavContext);

  const guests = formData.guests ?? 1;
  const bedrooms = formData.bedrooms ?? 1;
  const beds = formData.beds ?? 1;
  const bathrooms = formData.bathrooms ?? 1;

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <HostFrame progress={[0.7, 0, 0]} nextDisabled={false}>
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Share some basics about your place
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          You'll add more details later, like bed types.
        </p>
        <div className="mt-8">
          <Counter
            label="Guests"
            value={guests}
            onChange={(val) => updateField("guests", val)}
            min={1}
            max={16}
          />
          <Counter
            label="Bedrooms"
            value={bedrooms}
            onChange={(val) => updateField("bedrooms", val)}
            min={1}
            max={10}
          />
          <Counter
            label="Beds"
            value={beds}
            onChange={(val) => updateField("beds", val)}
            min={1}
            max={20}
          />
          <Counter
            label="Bathrooms"
            value={bathrooms}
            onChange={(val) => updateField("bathrooms", val)}
            min={1}
            max={8}
          />
        </div>
      </div>
    </HostFrame>
  );
}