import { useContext } from "react";
import HostFrame from "./HostFrame";
import { HostNavContext } from "./HostNavContext";

export default function SetupIntro() {
  const { onNext } = useContext(HostNavContext);
  return (
    <HostFrame progress={[0, 0, 0]} showNext={false}>
      <div className="max-w-6xl mx-auto px-8 md:px-16 py-16 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">Set up your StayNest listing</h1>
          <p className="mt-6 text-gray-600 text-lg">It only takes a few steps to get started.</p>
          <div className="mt-8">
            <label className="block text-sm font-semibold mb-2">Where's your place located?</label>
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-black"
            />
          </div>
          <button onClick={onNext || undefined} className="mt-6 px-6 py-3 rounded-lg bg-black text-white text-sm font-semibold">Continue</button>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
            alt="Villa preview"
            className="w-full h-72 object-cover"
          />
          <div className="p-4">
            <div className="font-semibold">Cozy Villa in Goa</div>
            <div className="text-sm text-gray-500 mt-1">Entire villa · 3 guests · 2 beds</div>
          </div>
        </div>
      </div>
    </HostFrame>
  );
}
