import HostFrame from "./HostFrame";

export default function PricingStep() {
  return (
    <HostFrame progress={[1, 1, 0.5]}>
      <div className="max-w-2xl mx-auto px-8 md:px-16 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">Now, set your prices</h1>
        <p className="mt-3 text-gray-600 text-center">
          These suggestions are based on guest demand for similar listings.{" "}
          <a className="underline font-semibold">Learn more</a>
        </p>
        <div className="mt-10 space-y-4">
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="text-sm text-gray-500">Base price</div>
            <div className="text-4xl font-extrabold mt-1">₹1,827</div>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6 flex items-end justify-between">
            <div>
              <div className="text-sm text-gray-500">Weekend adjustment</div>
              <div className="text-4xl font-extrabold mt-1">+2%</div>
            </div>
            <div className="text-xs text-gray-500 pb-2">₹1,864 for Fri and Sat</div>
          </div>
        </div>
      </div>
    </HostFrame>
  );
}
