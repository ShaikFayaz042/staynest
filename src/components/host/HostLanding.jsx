import HostFrame from "./HostFrame";
import StayNestLogo from "../../assets/logos/StayNestLogo";

export default function HostLanding() {
  return (
    <HostFrame showGetStarted hideFooter>
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
            Your home could make <span className="text-[#FF385C]">₹1.2L</span> on StayNest
          </h1>
          <div className="mt-10">
            <input type="range" defaultValue={30} className="w-full accent-[#FF385C]" />
          </div>
          <button className="mt-8 px-6 py-4 rounded-lg text-white text-base font-semibold"
            style={{ background: "linear-gradient(90deg,#FF385C,#E61E4D)" }}>
            Estimate your earnings
          </button>
        </div>
        <div className="rounded-3xl bg-gray-50 aspect-square flex items-center justify-center">
          <div className="w-56 h-56 opacity-90">
            <StayNestLogo theme="light" width={224} height={224} />
          </div>
        </div>
      </div>
      <section className="max-w-6xl mx-auto px-8 md:px-16 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Join millions of hosts on StayNest
        </h2>
        <p className="mt-4 text-lg text-gray-600">Earn extra income sharing your space with travellers worldwide.</p>
      </section>
    </HostFrame>
  );
}
