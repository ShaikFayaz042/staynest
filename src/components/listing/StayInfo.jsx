export default function StayInfo({ list }) {
  return (
    <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{list.title}</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {`${list.guests} guests · ${list.bedroomsCount} ${list.bedroomsCount === 1 ? "bedroom" : "bedrooms"}  · ${list.beds} beds · ${list.bathrooms} bathrooms`}
      </p>
    </section>
  );
}