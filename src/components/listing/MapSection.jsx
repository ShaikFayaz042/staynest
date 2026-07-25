export default function MapSection() {
  return (
    <section className="border-b border-gray-200 py-8">
      <h3 className="text-xl font-semibold text-gray-900">Where you'll be</h3>
      <p className="mt-1 text-sm text-gray-700">Baga, Goa, India</p>
      <div className="mt-4 h-105 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80"
          alt="Map showing Baga, Goa, India"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
