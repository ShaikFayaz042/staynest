import MapboxMap from "../common/MapboxMap";

export default function MapSection({ location }) {
  if (!location?.latitude || !location?.longitude) {
    return (
      <section className="border-b border-gray-200 dark:border-gray-700 py-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Where you'll be</h3>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Location coordinates are not available.</p>
      </section>
    );
  }

  return (
    <section className="border-b border-gray-200 dark:border-gray-700 py-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Where you'll be</h3>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{location.address}, {location.city}, {location.state}</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
        <MapboxMap
          latitude={Number(location.latitude)}
          longitude={Number(location.longitude)}
          draggable={false}
          disableMapClickMove={true}
          zoom={13}
          className="w-full h-[420px]"
        />
      </div>
    </section>
  );
}