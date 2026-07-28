import { useContext } from "react";
import { HostNavContext } from "./HostNavContext";
import HostFrame from "./HostFrame";

export default function PricingStep() {
  const { formData, setFormData } = useContext(HostNavContext);

  const basePrice = formData.basePrice ?? 1827;
  const weekendAdjustment = formData.weekendAdjustment ?? 2;

  const updateBasePrice = (value) => {
    const newPrice = Math.max(1, value);
    setFormData({ ...formData, basePrice: newPrice });
  };

  const updateWeekendAdjustment = (value) => {
    const newAdjust = Math.max(0, Math.min(100, value));
    setFormData({ ...formData, weekendAdjustment: newAdjust });
  };

  const weekendPrice = Math.round(basePrice * (1 + weekendAdjustment / 100));

  return (
    <HostFrame progress={[1, 1, 0.5]} nextDisabled={false}>
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
          Now, set your prices
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-center text-sm">
          These suggestions are based on guest demand for similar listings.{" "}
          <button className="underline font-semibold hover:text-gray-900 dark:hover:text-gray-100">
            Learn more
          </button>
        </p>

        <div className="mt-8 space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-white dark:bg-gray-900">
            <div className="text-sm text-gray-500 dark:text-gray-400">Base price (per night)</div>
            <div className="flex items-center gap-4 mt-1">
              <button
                onClick={() => updateBasePrice(basePrice - 100)}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#FF385C] dark:hover:border-[#FF385C] flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => updateBasePrice(Number(e.target.value))}
                className="w-32 text-center text-3xl font-extrabold outline-none border-b-2 border-transparent bg-transparent text-gray-900 dark:text-white focus:border-[#FF385C]"
                min="1"
                step="100"
              />
              <button
                onClick={() => updateBasePrice(basePrice + 100)}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#FF385C] dark:hover:border-[#FF385C] flex items-center justify-center"
              >
                +
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">₹ / night</span>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-white dark:bg-gray-900">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Weekend adjustment</div>
                <div className="flex items-center gap-4 mt-1">
                  <button
                    onClick={() => updateWeekendAdjustment(weekendAdjustment - 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#FF385C] dark:hover:border-[#FF385C] flex items-center justify-center"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={weekendAdjustment}
                    onChange={(e) => updateWeekendAdjustment(Number(e.target.value))}
                    className="w-16 text-center text-2xl font-extrabold outline-none border-b-2 border-transparent bg-transparent text-gray-900 dark:text-white focus:border-[#FF385C]"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <button
                    onClick={() => updateWeekendAdjustment(weekendAdjustment + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#FF385C] dark:hover:border-[#FF385C] flex items-center justify-center"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">%</span>
                </div>
              </div>
              <div className="text-right pb-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">Weekend price</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">₹{weekendPrice}</div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {weekendAdjustment > 0
            ? `Weekend nights are ${weekendAdjustment}% higher at ₹${weekendPrice}`
            : `No weekend adjustment (0%)`}
        </p>
      </div>
    </HostFrame>
  );
}