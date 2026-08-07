import { useContext, useState, useEffect } from "react";
import { HostNavContext } from "./HostNavContext";
import HostFrame from "./HostFrame";
import MapboxMap from "../common/MapboxMap";

export default function MapPinStep() {
  const { formData, setFormData } = useContext(HostNavContext);

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
  const location = formData.location || {
    latitude: 28.6139,
    longitude: 77.209,
  };

  const [searchValue, setSearchValue] = useState("");

  const getAddressText = (addr = address) => {
    return [addr.flat, addr.street, addr.city, addr.district, addr.state, addr.pincode, addr.country]
      .filter(Boolean)
      .join(", ")
      .trim();
  };

  const buildSearchQueries = (value) => {
    const baseValue = value?.trim();
    const candidates = [];

    if (baseValue) {
      const full = [baseValue, address.district, address.city, address.state, address.pincode, address.country]
        .filter(Boolean)
        .join(", ");
      candidates.push(full);
      candidates.push([baseValue, address.city, address.state, address.country].filter(Boolean).join(", "));
      candidates.push([baseValue, address.district, address.state, address.country].filter(Boolean).join(", "));
      candidates.push([baseValue, address.state, address.country].filter(Boolean).join(", "));
      candidates.push([baseValue, address.country].filter(Boolean).join(", "));
    }

    return Array.from(new Set(candidates.filter(Boolean)));
  };

  useEffect(() => {
    setSearchValue(getAddressText(address));
  }, [address.flat, address.street, address.city, address.state, address.country]);

  useEffect(() => {
    const hasAddress = Boolean(
      address.flat?.trim() ||
      address.street?.trim() ||
      address.city?.trim() ||
      address.district?.trim() ||
      address.state?.trim() ||
      address.pincode?.trim()
    );
    if (!hasAddress) return;

    const hasLocation = Boolean(formData.location?.latitude && formData.location?.longitude);
    if (hasLocation) return;

    const initialQuery = buildSearchQueries(getAddressText(address))[0];
    if (initialQuery) {
      geocodePlace(initialQuery);
    }
  }, [address.flat, address.street,address.city,address.district,address.state,address.pincode,address.country,formData.location?.latitude,formData.location?.longitude]);

  const updateLocation = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...(prev.location || {}),
        latitude,
        longitude,
      },
    }));
  };

  const updateAddressFields = (nextAddress) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...(prev.address || {}),
        ...nextAddress,
      },
    }));
  };

  const geocodePlace = async (query) => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token || !query?.trim()) return;

    const proximity = formData.location?.longitude && formData.location?.latitude
      ? `${formData.location.longitude},${formData.location.latitude}`
      : `${address.longitude || 77.209},${address.latitude || 28.6139}`;

    const candidates = buildSearchQueries(query);

    for (const candidate of candidates) {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(candidate)}.json?limit=3&proximity=${proximity}&access_token=${token}`
        );
        const data = await res.json();
        const feature = data.features?.[0];

        if (!feature) continue;

        const [longitude, latitude] = feature.center || [];
        const context = feature.context || [];
        const placeContext = context.find((item) => item.id.startsWith("place") || item.id.startsWith("locality"));
        const districtContext = context.find((item) => item.id.startsWith("district"));
        const regionContext = context.find((item) => item.id.startsWith("region"));
        const countryContext = context.find((item) => item.id.startsWith("country"));
        const postcodeContext = context.find((item) => item.id.startsWith("postcode"));

        const nextAddress = {
          street: feature.address || feature.text || address.street || "",
          city: placeContext?.text || address.city || "",
          district: districtContext?.text || address.district || "",
          state: regionContext?.text || address.state || "",
          country: countryContext?.text || address.country || "India",
          pincode: postcodeContext?.text || address.pincode || "",
        };

        updateAddressFields(nextAddress);
        updateLocation({ latitude, longitude });
        setSearchValue(getAddressText({ ...address, ...nextAddress }));
        return;
      } catch (error) {
        console.error("Geocoding failed", error);
      }
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${token}`
      );
      const data = await res.json();
      const feature = data.features?.[0];

      if (!feature) return;

      const context = feature.context || [];
      const placeContext = context.find((item) => item.id.startsWith("place") || item.id.startsWith("locality"));
      const regionContext = context.find((item) => item.id.startsWith("region"));
      const countryContext = context.find((item) => item.id.startsWith("country"));
      const postcodeContext = context.find((item) => item.id.startsWith("postcode"));

      const nextAddress = {
        street: feature.address || feature.text || address.street || "",
        city: placeContext?.text || address.city || "",
        state: regionContext?.text || address.state || "",
        country: countryContext?.text || address.country || "India",
        pincode: postcodeContext?.text || address.pincode || "",
      };

      updateAddressFields(nextAddress);
      setSearchValue(getAddressText({ ...address, ...nextAddress }));
    } catch (error) {
      console.error("Reverse geocoding failed", error);
    }
  };

  const handleMapDrag = ({ latitude, longitude }) => {
    updateLocation({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    geocodePlace(searchValue);
  };

  const isValid = Boolean(
    location.latitude &&
    location.longitude &&
    address.street?.trim() &&
    address.city?.trim() &&
    address.state?.trim()
  );

  return (
    <HostFrame progress={[1, 0, 0]} showNext={true} nextDisabled={!isValid} nextLabel="Confirm pin location">
      <div className="h-full flex flex-col items-center">
        {/* Header section */}
        <div className=" shrink-0 px-6 md:px-10 py-5  dark:bg-gray-950">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Is the pin in the right spot?
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
            Your address is only shared with guests after they've made a reservation.
          </p>

          {/* Address input */}
          <form onSubmit={handleAddressSubmit} className="mt-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-2xl px-3 py-2.5 border border-gray-200 dark:border-gray-800">
            <div className="text-[#ff385c] text-lg shrink-0 mt-0.5">📍</div>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={() => geocodePlace(searchValue)}
              placeholder="Enter address or place"
              className="flex-1 bg-transparent text-sm font-medium text-gray-900 dark:text-white outline-none placeholder-gray-400"
            />
          </form>
        </div>

        {/* Map section - takes remaining space */}
        <div className="w-full flex-1 overflow-hidden px-4 sm:px-6 md:px-8 py-4 pb-6 dark:bg-gray-900">
          <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
            <MapboxMap
              latitude={Number(location.latitude)}
              longitude={Number(location.longitude)}
              draggable={true}
              onDragEnd={handleMapDrag}
              zoom={15}
              className="w-full h-full"
            />

            {/* Overlay instruction */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold whitespace-nowrap pointer-events-none z-10">
              Drag the map to reposition the pin
            </div>

            {/* Coordinates display */}
            <div className="absolute top-6 left-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-sm z-10">
              <div className="font-semibold">Coordinates</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Lat: {location.latitude.toFixed(6)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Lon: {location.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HostFrame>
  );
}
