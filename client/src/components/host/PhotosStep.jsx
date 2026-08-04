import HostFrame from "./HostFrame";

export default function PhotosStep() {
  return (
    <HostFrame progress={[1, 0.5, 0]} nextDisabled>
      <div className="max-w-3xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Add some photos of your house</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">You'll need 5 photos to get started. You can add more or make changes later.</p>
        <div className="mt-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-white/70 dark:bg-gray-900/70">
          <i className="fa-regular fa-image text-5xl text-gray-400 dark:text-gray-500" />
          <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Drag your photos here</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Choose at least 5 photos</p>
          <button className="mt-6 px-5 py-3 rounded-lg border border-gray-900 dark:border-gray-100 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800">
            Upload from your device
          </button>
        </div>
      </div>
    </HostFrame>
  );
}
