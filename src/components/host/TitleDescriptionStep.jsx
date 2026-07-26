import HostFrame from "./HostFrame";

export default function TitleDescriptionStep() {
  return (
    <HostFrame progress={[1, 0.75, 0]}>
      <div className="max-w-3xl mx-auto px-8 md:px-16 py-12 space-y-14">
        {/* Title */}
        <section>
          <h1 className="text-4xl font-extrabold text-gray-900">Now, let's give your house a title</h1>
          <p className="mt-3 text-gray-600">Short titles work best. Have fun with it — you can always change it later.</p>
          <textarea
            className="mt-6 w-full h-40 border-2 border-black rounded-xl p-4 text-lg outline-none resize-none"
            maxLength={50}
            defaultValue=""
          />
          <div className="mt-2 text-sm text-gray-500">0/50</div>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-4xl font-extrabold text-gray-900">Create your description</h2>
          <p className="mt-3 text-gray-600">Share what makes your place special.</p>
          <textarea
            className="mt-6 w-full h-56 border-2 border-black rounded-xl p-4 text-lg outline-none resize-none"
            maxLength={500}
            defaultValue="You'll have a great time at this comfortable place to stay."
          />
          <div className="mt-2 text-sm text-gray-500">59/500</div>
        </section>
      </div>
    </HostFrame>
  );
}
