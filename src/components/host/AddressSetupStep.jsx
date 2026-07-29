import { useContext } from "react";
import { HostNavContext } from "./HostNavContext";
import HostFrame from "./HostFrame";

export default function AddressSetupStep() {
  const { formData, setFormData } = useContext(HostNavContext);

  // Get address from formData or use defaults
  const address = formData.address || {
    country: "India",
    flat: "",
    street: "",
    landmark: "",
    district: "",
    city: "",
    state: "",
    pincode: "",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      address: { ...address, [e.target.name]: e.target.value },
    });
  };

  // Validate required fields
  const isValid =
    address.street.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state.trim() !== "" &&
    address.pincode.trim() !== "";

  return (
    <HostFrame progress={[0, 0, 0]} showNext={true} nextDisabled={!isValid}>
      <div className="max-w-6xl mx-auto px-8 md:px-16 py-12 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Set up your StayNest listing
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
            It only takes a few steps to get started. Please provide the address of your place.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Country / Region</label>
              <input
                name="country"
                value={address.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Flat, house, etc. (optional)</label>
              <input
                name="flat"
                value={address.flat}
                onChange={handleChange}
                placeholder="e.g. Apartment 4B"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Street address *</label>
              <input
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="e.g. 123 Main Road"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Landmark (optional)</label>
              <input
                name="landmark"
                value={address.landmark}
                onChange={handleChange}
                placeholder="e.g. Near City Hospital"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">District / Locality (optional)</label>
              <input
                name="district"
                value={address.district}
                onChange={handleChange}
                placeholder="e.g. Indiranagar"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">City / Town / Village *</label>
              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">State / Union Territory *</label>
              <input
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="e.g. Karnataka"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">PIN code *</label>
              <input
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="e.g. 560001"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 sticky top-8 bg-gray-50 dark:bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
            alt="Villa preview"
            className="w-full h-72 object-cover"
          />
          <div className="p-4">
            <div className="font-semibold text-gray-900 dark:text-white">Cozy Villa in Goa</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Entire villa · 3 guests · 2 beds</div>
          </div>
        </div>
      </div>
    </HostFrame>
  );
}