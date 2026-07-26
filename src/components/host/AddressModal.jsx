export default function AddressModal() {
  const fields = [
    { label: "Country / Region", value: "India" },
    { label: "Flat, house, etc. (optional)", value: "" },
    { label: "Street address", value: "MG Road" },
    { label: "Landmark (optional)", value: "" },
    { label: "District / Locality (optional)", value: "" },
    { label: "City / Town / Village", value: "Kurnool" },
    { label: "State / Union Territory", value: "Andhra Pradesh" },
    { label: "PIN code", value: "518001" },
  ];
  return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center p-8" style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl">×</button>
          <h2 className="text-base font-semibold">Confirm your address</h2>
          <div className="w-8" />
        </div>
        <div className="overflow-y-auto px-6 py-4 space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="border border-gray-300 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-500">{f.label}</div>
              <input defaultValue={f.value} className="w-full outline-none text-sm" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <button className="text-sm font-semibold underline">Cancel</button>
          <button className="px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}
