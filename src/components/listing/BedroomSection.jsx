export default function BedroomSection({ list }) {
  const bedrooms = list.bedrooms || [];

  return (
    <section className="border-b border-gray-200 py-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Where you'll sleep</h3>
      <div className="grid grid-cols-2 gap-4">
        {bedrooms.map((b) => (
          <div key={b.id}>
            <div className="aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={b.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70"}
                alt={b.title}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">{b.title}</p>
            <p className="text-xs text-gray-500">{b.beds} bed{b.beds > 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}