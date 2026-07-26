import HostFrame from "./HostFrame";

export default function StepIntro({ step = 1, title = "Tell us about your place", description = "In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.", image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900" }) {
  return (
    <HostFrame progress={[step >= 1 ? 1 : 0, step >= 2 ? 1 : 0, step >= 3 ? 1 : 0]}>
      <div className="max-w-6xl mx-auto px-8 md:px-16 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-sm font-semibold text-gray-500">Step {step}</div>
          <h1 className="mt-3 text-5xl font-extrabold text-gray-900 leading-tight">{title}</h1>
          <p className="mt-6 text-gray-600 text-lg">{description}</p>
        </div>
        <img src={image} alt={`Step ${step}`} className="rounded-3xl w-full aspect-square object-cover" />
      </div>
    </HostFrame>
  );
}
