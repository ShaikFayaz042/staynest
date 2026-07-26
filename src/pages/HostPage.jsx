import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

export default function HostPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navbar type={"travelling"}></Navbar>
      <main className="px-8 md:px-16 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Your listing</h1>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
              <i className="fa-solid fa-table-cells text-sm" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
              <i className="fa-solid fa-plus text-sm" />
            </button>
          </div>
        </div>
        <div className="mt-8 max-w-sm">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
              alt="Listing"
              className="w-full h-72 object-cover"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" /> Action required
            </span>
          </div>
          <div className="mt-3">
            <div className="font-semibold">Cozy Hill Home</div>
            <div className="text-sm text-gray-500">Home in Kurnool, India</div>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
