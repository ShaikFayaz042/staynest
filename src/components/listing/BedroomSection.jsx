
export default function BedroomSection({list}) {
  return (
    <section className="border-b border-gray-200 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Where you'll sleep</h3>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>1 / {list.bedrooms.length}</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
            <i className="fa-solid fa-chevron-left text-xs" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
            <i className="fa-solid fa-chevron-right text-xs" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {list.bedrooms.map((b) => (
          <div key={b.title}>
            <div className="aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
              <img src={b.images} alt={b.title} className="h-full w-full object-cover" />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">{b.title}</p>
            <p className="text-xs text-gray-500">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
