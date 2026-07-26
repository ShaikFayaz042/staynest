export default function UploadModal() {
  return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center p-8" style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl">×</button>
          <div className="text-center">
            <h2 className="text-base font-semibold">Upload photos</h2>
            <div className="text-xs text-gray-500">1 item selected</div>
          </div>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl">+</button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative rounded-xl overflow-hidden aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600"
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center">
                <i className="fa-regular fa-trash-can text-sm" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <button className="text-sm font-semibold underline">Cancel</button>
          <button className="px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold">Upload</button>
        </div>
      </div>
    </div>
  );
}
