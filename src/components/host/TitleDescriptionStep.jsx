import { useContext } from "react";
import { HostNavContext } from "./HostNavContext";
import HostFrame from "./HostFrame";

export default function TitleDescriptionStep() {
  const { formData, setFormData } = useContext(HostNavContext);

  const title = formData.title || "";
  const description = formData.description || "";

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  return (
    <HostFrame progress={[1, 0.75, 0]} nextDisabled={!isValid}>
      <div className="max-w-3xl mx-auto px-8 md:px-16 py-8 space-y-10">
        <section>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Now, let's give your house a title
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Short titles work best. Have fun with it — you can always change it later.
          </p>
          <textarea
            value={title}
            onChange={handleTitleChange}
            className="mt-4 w-full h-28 border-2 border-black rounded-xl p-4 text-base outline-none resize-none focus:border-gray-600"
            maxLength={50}
            placeholder="e.g. Cozy Beachfront Villa"
          />
          <div className="mt-1 text-sm text-gray-500 text-right">
            {title.length}/50
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your description
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Share what makes your place special.
          </p>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="mt-4 w-full h-40 border-2 border-black rounded-xl p-4 text-base outline-none resize-none focus:border-gray-600"
            maxLength={500}
            placeholder="Describe your space, neighbourhood, and what guests can expect..."
          />
          <div className="mt-1 text-sm text-gray-500 text-right">
            {description.length}/500
          </div>
        </section>
      </div>
    </HostFrame>
  );
}