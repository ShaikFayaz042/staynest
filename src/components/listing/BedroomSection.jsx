const BEDROOMS = [
  {
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=70",
    title: "Bedroom 1",
    desc: "1 queen bed, 1 floor mattress",
  },
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=70",
    title: "Bedroom 2",
    desc: "1 king bed",
  },
];

export default function BedroomSection() {
  return (
    <section className="border-b border-gray-200 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Where you'll sleep</h3>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>1 / 2</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
            <i className="fa-solid fa-chevron-left text-xs" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
            <i className="fa-solid fa-chevron-right text-xs" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {BEDROOMS.map((b) => (
          <div key={b.title}>
            <div className="aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
              <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">{b.title}</p>
            <p className="text-xs text-gray-500">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
