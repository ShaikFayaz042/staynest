import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createListing as apiCreateListing } from "../api/listings";
import { uploadImages } from "../api/imagekit";
import { HostNavContext } from "../components/host/HostNavContext";
import AddressSetupStep from "../components/host/AddressSetupStep";
import MapPinStep from "../components/host/MapPinStep";
import StepIntro from "../components/host/StepIntro";
import PropertyTypeStep from "../components/host/PropertyTypeStep";
import BasicsStep from "../components/host/BasicsStep";
import AmenitiesStep from "../components/host/AmenitiesStep";
import PhotosStep from "../components/host/PhotosStep";
import TitleDescriptionStep from "../components/host/TitleDescriptionStep";
import PricingStep from "../components/host/PricingStep";

// Helper to load amenities from localStorage
function getAmenitiesMap() {
  const FALLBACK = {
    basics: [
      { id: "b1", name: "Air conditioning", icon: "fa-solid fa-snowflake" },
      { id: "b2", name: "Essentials", icon: "fa-solid fa-suitcase-rolling" },
      { id: "b3", name: "Fridge", icon: "fa-solid fa-box" },
      { id: "b4", name: "Heating", icon: "fa-solid fa-temperature-arrow-up" },
      { id: "b5", name: "Hot water", icon: "fa-solid fa-faucet-drip" },
      { id: "b6", name: "Kitchen", icon: "fa-solid fa-kitchen-set" },
      { id: "b7", name: "TV", icon: "fa-solid fa-tv" },
      { id: "b8", name: "Tumble dryer", icon: "fa-solid fa-wind" },
      { id: "b9", name: "Washing machine", icon: "fa-solid fa-shirt" },
      { id: "b10", name: "Wifi", icon: "fa-solid fa-wifi" }
    ],
    popular: [
      { id: "p1", name: "Coffee maker", icon: "fa-solid fa-mug-hot" },
      { id: "p2", name: "Cooking basics", icon: "fa-solid fa-utensils" },
      { id: "p3", name: "Hairdryer", icon: "fa-solid fa-wind" },
      { id: "p4", name: "Hangers", icon: "fa-solid fa-shirt" },
      { id: "p5", name: "Iron", icon: "fa-solid fa-bolt" },
      { id: "p6", name: "Shampoo", icon: "fa-solid fa-bottle-droplet" },
      { id: "p7", name: "Dedicated workspace", icon: "fa-solid fa-laptop" },
      { id: "p8", name: "EV charger", icon: "fa-solid fa-charging-station" },
      { id: "p9", name: "Free parking", icon: "fa-solid fa-square-parking" },
      { id: "p10", name: "Gym", icon: "fa-solid fa-dumbbell" },
      { id: "p11", name: "Hot tub", icon: "fa-solid fa-hot-tub-person" },
      { id: "p12", name: "Indoor fireplace", icon: "fa-solid fa-fire" },
      { id: "p13", name: "Outdoor furniture", icon: "fa-solid fa-chair" },
      { id: "p14", name: "Pool", icon: "fa-solid fa-water-ladder" }
    ],
    location: [
      { id: "l1", name: "Beach access", icon: "fa-solid fa-umbrella-beach" },
      { id: "l2", name: "Waterfront", icon: "fa-solid fa-water" },
      { id: "l3", name: "Mountain view", icon: "fa-solid fa-mountain" },
      { id: "l4", name: "City view", icon: "fa-solid fa-city" },
      { id: "l5", name: "Garden view", icon: "fa-solid fa-leaf" }
    ],
    safety: [
      { id: "s1", name: "Carbon monoxide alarm", icon: "fa-solid fa-cloud" },
      { id: "s2", name: "Smoke alarm", icon: "fa-solid fa-bell" },
      { id: "s3", name: "First aid kit", icon: "fa-solid fa-kit-medical" },
      { id: "s4", name: "Fire extinguisher", icon: "fa-solid fa-fire-extinguisher" },
      { id: "s5", name: "Security cameras", icon: "fa-solid fa-video" }
    ]
  };

  try {
    const raw = localStorage.getItem("amenities");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        // Flatten into { id: name } map
        const map = {};
        Object.values(parsed).forEach(category => {
          category.forEach(item => {
            map[item.id] = item.name;
          });
        });
        return map;
      }
    }
  } catch (e) {
    console.warn("Failed to parse amenities from localStorage", e);
  }

  // Flatten fallback
  const map = {};
  Object.values(FALLBACK).forEach(category => {
    category.forEach(item => {
      map[item.id] = item.name;
    });
  });
  return map;
}

function buildListingPayload(data) {
  const addr = data.address || {};
  const location = {
    country: addr.country || "India",
    state: addr.state || "",
    city: addr.city || "",
    address: `${addr.flat ? addr.flat + ", " : ""}${addr.street || ""}`.trim(),
    latitude: data.location?.latitude ?? parseFloat(addr.latitude) ?? 28.6139,
    longitude: data.location?.longitude ?? parseFloat(addr.longitude) ?? 77.209,
  };

  const bedroomsCount = data.bedrooms || 1;
  const totalBeds = data.beds || 1;
  let bedsPerRoom = Math.floor(totalBeds / bedroomsCount);
  let remaining = totalBeds - bedsPerRoom * bedroomsCount;
  const bedrooms = [];

  for (let i = 0; i < bedroomsCount; i++) {
    let bedCount = bedsPerRoom + (remaining > 0 ? 1 : 0);
    if (remaining > 0) remaining--;
    if (bedCount === 0) bedCount = 1;
    bedrooms.push({
      title: `Bedroom ${i + 1}`,
      beds: bedCount,
      images: [],
    });
  }

  const amenityMap = getAmenitiesMap();
  const amenityNames = (data.amenities || []).map((id) => amenityMap[id]).filter(Boolean);

  return {
    title: data.title || "Untitled",
    description: data.description || "",
    category: data.category || "House",
    location,
    pricePerNight: data.basePrice || 1827,
    guests: data.guests || 1,
    beds: totalBeds,
    bedroomsCount,
    bathrooms: data.bathrooms || 1,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70",
    ],
    bedrooms,
    amenities: amenityNames,
  };
}

const PHASES = [
  { start: 0, end: 3 },
  { start: 4, end: 7 },
  { start: 8, end: 10 },
];

function computeProgress(index) {
  return PHASES.map(({ start, end }) => {
    if (index <= start) return 0;
    if (index >= end) return 1;
    return (index - start) / (end - start);
  });
}

function isStepValid(index, formData) {
  switch (index) {
    case 1: {
      const address = formData.address || {};
      return Boolean(
        address.street?.trim() &&
        address.city?.trim() &&
        address.state?.trim() &&
        address.pincode?.trim()
      );
    }
    case 2:
      return Boolean(formData.category);
    case 3: {
      // Basics step - any valid selection
      return true;
    }
    case 5: {
      // Amenities step – require at least 4 selected
      const amenities = formData.amenities || [];
      return amenities.length >= 4;
    }
    case 6: {
      const bedroomPhotos = Array.isArray(formData.bedroomPhotos) ? formData.bedroomPhotos : [];
      const bedrooms = Number(formData.bedrooms || 1);
      return (
        bedroomPhotos.length === bedrooms &&
        bedroomPhotos.every((group) => Array.isArray(group) && group.length > 0)
      );
    }
    case 7:
      return Boolean(formData.title?.trim() && formData.description?.trim());
    case 8:
      return true;
    case 9: {
      const location = formData.location || {};
      return Boolean(
        location.latitude &&
        location.longitude &&
        formData.address?.street?.trim() &&
        formData.address?.city?.trim() &&
        formData.address?.state?.trim()
      );
    }
    default:
      return true;
  }
}

export default function HostWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const handlePublish = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPublishError("");
    setIsPublishing(true);

    try {
      const payload = buildListingPayload(formData);
      const images = formData.photos?.length
        ? await uploadImages(formData.photos, "/staynest/listings/main")
        : payload.images;

      const bedroomImages = [];
      for (let i = 0; i < payload.bedrooms.length; i += 1) {
        const files = Array.isArray(formData.bedroomPhotos?.[i]) ? formData.bedroomPhotos[i] : [];
        bedroomImages.push(files.length ? await uploadImages(files, "/staynest/listings/bedrooms") : []);
      }

      const bedrooms = payload.bedrooms.map((bedroom, index) => ({
        ...bedroom,
        images: bedroomImages[index] || [],
      }));

      await apiCreateListing({ ...payload, images, bedrooms });
      navigate("/host");
    } catch (error) {
      setPublishError(error.message || "Unable to publish listing.");
    } finally {
      setIsPublishing(false);
    }
  };

  const steps = [
    <StepIntro
      step={1}
      title="Tell us about your place"
      description="We'll start with the basics: where your place is, what type it is, and how many guests it can host."
    />,
    <AddressSetupStep />,
    <PropertyTypeStep />,
    <BasicsStep />,
    <StepIntro
      step={2}
      title="Make your place stand out"
      description="Now add amenities, photos, and a compelling title and description."
    />,
    <AmenitiesStep />,
    <PhotosStep />,
    <TitleDescriptionStep />,
    <StepIntro
      step={3}
      title="Finish up and publish"
      description="Finally, confirm your listing's exact location and set your pricing."
    />,
    <MapPinStep />,
    <PricingStep />,
    // Success screen
    <div className="max-w-2xl mx-auto px-8 md:px-16 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Your listing is ready!</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">You can now publish this listing and view it on your dashboard.</p>
      {publishError && <p className="mt-4 text-sm text-red-500">{publishError}</p>}
      <button
        onClick={handlePublish}
        disabled={isPublishing}
        className={`mt-8 px-6 py-3 rounded-lg text-sm font-semibold transition ${
          isPublishing
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
        }`}
      >
        {isPublishing ? "Publishing…" : "Publish listing"}
      </button>
    </div>,
  ];

  const total = steps.length;
  const nextDisabled = !isStepValid(index, formData);

  const onNext = () => {
    if (nextDisabled) return;
    setIndex((i) => Math.min(i + 1, total - 1));
  };
  const onBack = () => setIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index]);

  const progress = computeProgress(index);
  const isLast = index === total - 1;

  return (
    <HostNavContext.Provider value={{ onNext, onBack, inWizard: true, index, total, formData, setFormData, nextDisabled }}>
      <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-950" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / total)}%)`,
            width: `${total * 100}%`,
          }}
        >
          {steps.map((step, i) => (
            <div key={i} style={{ width: `${100 / total}%` }} className="shrink-0 h-full">
              {step}
            </div>
          ))}
        </div>

        {!isLast && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-40">
            <div className="grid grid-cols-3 gap-2">
              {progress.map((p, i) => (
                <div key={i} className="h-1 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                  <div
                    className="h-full bg-[#fd4148] transition-all duration-500"
                    style={{ width: `${p * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-8 md:px-16 py-4">
              <button
                onClick={onBack}
                disabled={index === 0}
                className={`text-sm font-semibold underline ${index === 0 ? "text-gray-300 dark:text-gray-600 cursor-not-allowed no-underline" : "text-gray-900 dark:text-gray-100"
                  }`}
              >
                Back
              </button>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Step {index + 1} of {total - 1}
              </div>
              <button
                onClick={onNext}
                disabled={nextDisabled}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${nextDisabled
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-[#fd4148] text-white hover:bg-[#f13c46] dark:bg-[#fd4148] dark:hover:bg-[#f13c46]"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </HostNavContext.Provider>
  );
}