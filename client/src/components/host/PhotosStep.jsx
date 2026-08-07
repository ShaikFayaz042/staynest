import { useContext, useEffect, useRef, useState } from "react";
import HostFrame from "./HostFrame";
import { HostNavContext } from "./HostNavContext";

export default function PhotosStep() {
  const { formData, setFormData } = useContext(HostNavContext);
  const photos = formData.photos || [];
  const bedroomCount = Number(formData.bedrooms || 1);
  const bedroomPhotos = Array.isArray(formData.bedroomPhotos) ? formData.bedroomPhotos : [];
  const bedroomPhotoMissing = Array.from({ length: bedroomCount }, (_, index) =>
    !Array.isArray(bedroomPhotos[index]) || bedroomPhotos[index].length === 0
  );
  const bedroomPhotosValid = bedroomPhotoMissing.every((missing) => !missing);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const bedroomInputRefs = useRef([]);

  useEffect(() => {
    const previewUrls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  useEffect(() => {
    setFormData((prev) => {
      const existing = Array.isArray(prev.bedroomPhotos) ? prev.bedroomPhotos : [];
      const nextGroups = Array.from({ length: bedroomCount }, (_, index) => existing[index] || []);
      if (nextGroups.length === existing.length && nextGroups.every((group, index) => group === existing[index])) {
        return prev;
      }
      return { ...prev, bedroomPhotos: nextGroups };
    });
  }, [bedroomCount, setFormData]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setFormData((prev) => ({ ...prev, photos: selectedFiles }));
    }
  };

  const handleBedroomFileChange = (index, event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setFormData((prev) => {
        const nextGroups = Array.isArray(prev.bedroomPhotos) ? [...prev.bedroomPhotos] : [];
        nextGroups[index] = selectedFiles;
        return { ...prev, bedroomPhotos: nextGroups };
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = Array.from(event.dataTransfer.files || []).filter((file) => file.type.startsWith("image/"));
    if (droppedFiles.length > 0) {
      setFormData((prev) => ({ ...prev, photos: droppedFiles }));
    }
  };

  return (
    <HostFrame progress={[1, 0.5, 0]}>
      <div className="max-w-3xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Add some photos of your house</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">You'll need 5 photos to get started. You can add more or make changes later.</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          className="mt-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-white/70 dark:bg-gray-900/70"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <i className="fa-regular fa-image text-5xl text-gray-400 dark:text-gray-500" />
          <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Drag your photos here</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Choose at least 5 photos</p>

          <button
            type="button"
            onClick={handleButtonClick}
            className="mt-6 px-5 py-3 rounded-lg border border-gray-900 dark:border-gray-100 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Upload from your device
          </button>

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            {photos.length === 0
              ? "No photos selected yet."
              : `${photos.length} photo${photos.length === 1 ? "" : "s"} selected.`}
          </div>

          {previews.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {previews.map((preview, index) => (
                <div key={preview} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                  <img src={preview} alt={`Selected ${index + 1}`} className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bedroom photos</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Upload at least one photo for each bedroom. These will be saved with the bedroom details.
          </p>
          {!bedroomPhotosValid && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
              Please upload at least one photo for every bedroom before continuing.
            </div>
          )}

          <div className="mt-6 space-y-5">
            {Array.from({ length: bedroomCount }, (_, index) => {
              const selectedFiles = Array.isArray(bedroomPhotos[index]) ? bedroomPhotos[index] : [];
              return (
                <div
                  key={index}
                  className={`rounded-xl p-4 ${bedroomPhotoMissing[index] ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40" : "border-gray-200 dark:border-gray-700"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bedroom {index + 1}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} photo${selectedFiles.length === 1 ? "" : "s"} selected`
                          : "No photos uploaded yet"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => bedroomInputRefs.current[index]?.click()}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Upload photos
                    </button>
                  </div>
                  <input
                    ref={(element) => {
                      bedroomInputRefs.current[index] = element;
                    }}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleBedroomFileChange(index, event)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </HostFrame>
  );
}
