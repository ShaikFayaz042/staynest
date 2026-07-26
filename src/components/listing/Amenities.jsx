import amenities from "../../data/amenities";
export default function Amenities({ list }) {
  // 1. Saari categories ke arrays ko nikal kar ek single flat array mein convert karein
  const allAmenities = Object.values(amenities).flat();

  // 2. Ab pure data par list ke basis par filter lagayein
  const offers = allAmenities.filter(item => list.includes(item.name));

  console.log(offers);

  console.log(offers);
  return (
    <section className="border-b border-gray-200 py-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">What this place offers</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {offers.map((a) => (
          <div key={a.id} className="flex items-center gap-3 text-sm text-gray-800">
            <i className={`fa-solid ${a.icon} w-5 text-gray-700`} />
            <span >{a.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
