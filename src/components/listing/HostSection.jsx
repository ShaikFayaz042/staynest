export default function HostSection() {
  return (
    <section className="border-b border-gray-200 py-8">
      <h3 className="mb-6 text-xl font-semibold text-gray-900">Meet your host</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src="https://i.pravatar.cc/160?img=13"
                alt="Arpit"
                className="h-28 w-28 rounded-full object-cover"
              />
              <span className="absolute bottom-2 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white">
                <i className="fa-solid fa-check text-xs" />
              </span>
            </div>
            <div className="mt-2 text-xl font-bold text-gray-900">Arpit</div>
            <div className="text-xs text-gray-700">
              <i className="fa-solid fa-medal" /> Superhost
            </div>
          </div>
          <div className="flex-1 space-y-3 border-l border-gray-200 pl-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">103</div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="font-semibold text-gray-900">4.98 ★</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="font-semibold text-gray-900">1</div>
              <div className="text-xs text-gray-500">Year hosting</div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Arpit is a Superhost</p>
          <p className="mt-2 text-sm text-gray-700">
            Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
          </p>
          <p className="mt-6 font-semibold text-gray-900">Host details</p>
          <p className="mt-2 text-sm text-gray-700">Response rate: 100%</p>
          <p className="text-sm text-gray-700">Responds within an hour</p>
          <button className="mt-6 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900">
            Message host
          </button>
          <p className="mt-6 flex items-start gap-2 text-xs text-gray-600">
            <i className="fa-solid fa-shield mt-0.5 text-pink-500" />
            To help protect your payment, always use Airbnb to send money and communicate with hosts.
          </p>
        </div>
      </div>
    </section>
  );
}
