import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MapboxMap from '../components/common/MapboxMap';
import { uploadImages, deleteImage } from '../api/imagekit';
import { fetchListingById, updateListing as apiUpdateListing, deleteListing as apiDeleteListing } from '../api/listings';

// Inline categories (previously client/src/data/categories.js)
const categories = [
  { icon: "fa-house", name: "House" },
  { icon: "fa-building", name: "Flat" },
  { icon: "fa-warehouse", name: "Barn" },
  { icon: "fa-bed", name: "Bed & breakfast" },
  { icon: "fa-tree", name: "Cabin" },
  { icon: "fa-campground", name: "Campsite" },
  { icon: "fa-caravan", name: "Camper/RV" },
  { icon: "fa-hotel", name: "Casa particular" },
  { icon: "fa-castle", name: "Castle" },
  { icon: "fa-mountain", name: "Cave" },
  { icon: "fa-water", name: "Container" },
  { icon: "fa-igloo", name: "Cycladic home" },
];

// Inline amenities (previously client/src/data/amenities.js)
const amenitiesData = {
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
    { id: "b10", name: "Wifi", icon: "fa-solid fa-wifi" },
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
    { id: "p14", name: "Pool", icon: "fa-solid fa-water-ladder" },
  ],
  location: [
    { id: "l1", name: "Beach access", icon: "fa-solid fa-umbrella-beach" },
    { id: "l2", name: "Waterfront", icon: "fa-solid fa-water" },
    { id: "l3", name: "Mountain view", icon: "fa-solid fa-mountain" },
    { id: "l4", name: "City view", icon: "fa-solid fa-city" },
    { id: "l5", name: "Garden view", icon: "fa-solid fa-leaf" },
  ],
  safety: [
    { id: "s1", name: "Carbon monoxide alarm", icon: "fa-solid fa-cloud" },
    { id: "s2", name: "Smoke alarm", icon: "fa-solid fa-bell" },
    { id: "s3", name: "First aid kit", icon: "fa-solid fa-kit-medical" },
    { id: "s4", name: "Fire extinguisher", icon: "fa-solid fa-fire-extinguisher" },
    { id: "s5", name: "Security cameras", icon: "fa-solid fa-video" },
  ],
};

const emptyForm = {
  title: '',
  description: '',
  category: 'House',
  pricePerNight: '',
  guests: 1,
  beds: 1,
  bathrooms: 1,
  images: [],
  amenities: [],
  bedrooms: [],
  location: {
    address: '',
    city: '',
    state: '',
    country: 'India',
    latitude: '',
    longitude: '',
  },
};

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageError, setImageError] = useState('');
  const [availableAmenities] = useState(amenitiesData);
  const [validationError, setValidationError] = useState('');
  const allAmenityItems = Object.values(availableAmenities).flat();
  const amenityNameToId = Object.fromEntries(allAmenityItems.map((item) => [item.name, item.id]));
  const amenityIdToName = Object.fromEntries(allAmenityItems.map((item) => [item.id, item.name]));
  const fileInputRef = useRef(null);
  const bedroomInputRefs = useRef([]);

  useEffect(() => {
    async function loadListing() {
      try {
        const response = await fetchListingById(id);
        const listing = response?.data || null;

        if (!listing) {
          setError('Listing not found.');
          return;
        }

        setForm({
          title: listing.title || '',
          description: listing.description || '',
          category: listing.category || 'House',
          pricePerNight: listing.pricePerNight || '',
          guests: listing.guests || 1,
          beds: listing.beds || 1,
          bathrooms: listing.bathrooms || 1,
          images: Array.isArray(listing.images) ? listing.images : [],
          amenities: Array.isArray(listing.amenities)
            ? listing.amenities.map((amenity) => {
                if (allAmenityItems.some((item) => item.id === amenity)) return amenity;
                return amenityNameToId[amenity] || amenity;
              })
            : [],
          bedrooms: Array.isArray(listing.bedrooms)
            ? listing.bedrooms.map((bedroom, index) => ({
                title: bedroom.title || `Bedroom ${index + 1}`,
                beds: bedroom.beds || 1,
                images: Array.isArray(bedroom.images) ? bedroom.images : [],
              }))
            : [],
          location: {
            address: listing.location?.address || '',
            city: listing.location?.city || '',
            state: listing.location?.state || '',
            country: listing.location?.country || 'India',
            latitude: listing.location?.latitude ?? '',
            longitude: listing.location?.longitude ?? '',
          },
        });
      } catch (err) {
        setError(err.message || 'Failed to load listing.');
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValidationError('');

    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.title?.trim()) return 'Please enter a title.';
    if (!form.description?.trim()) return 'Please enter a description.';
    if (!form.category?.trim()) return 'Please select a category.';
    if (!form.pricePerNight || Number(form.pricePerNight) <= 0) return 'Please enter a valid price per night.';
    if (!form.guests || Number(form.guests) < 1) return 'Please enter at least 1 guest.';
    if (!form.beds || Number(form.beds) < 1) return 'Please enter at least 1 bed.';
    if (!form.bathrooms || Number(form.bathrooms) < 1) return 'Please enter at least 1 bathroom.';

    const listingPhotos = Array.isArray(form.images)
      ? form.images.filter((item) => typeof item === 'string' && item.trim())
      : [];
    if (listingPhotos.length < 5) return 'Please upload at least 5 listing photos.';

    const selectedAmenities = Array.isArray(form.amenities) ? form.amenities : [];
    if (selectedAmenities.length < 4) return 'Please select at least 4 amenities.';

    if (!form.location.address?.trim()) return 'Please enter the address.';
    if (!form.location.city?.trim()) return 'Please enter the city.';
    if (!form.location.state?.trim()) return 'Please enter the state.';
    if (!form.location.country?.trim()) return 'Please enter the country.';

    const bedroomIssue = Array.isArray(form.bedrooms)
      ? form.bedrooms.findIndex((bedroom) => !Array.isArray(bedroom.images) || bedroom.images.filter((item) => typeof item === 'string' && item.trim()).length < 1)
      : -1;
    if (bedroomIssue >= 0) return `Bedroom ${bedroomIssue + 1} requires at least one photo.`;

    return '';
  };

  const handleRemoveImage = async (index) => {
    if (!Array.isArray(form.images) || form.images.length <= 5) {
      setValidationError('Add a new photo before deleting this one. A minimum of 5 listing photos is required.');
      return;
    }

    setValidationError('');
    const imageUrl = form.images[index];
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    if (imageUrl) {
      try {
        await deleteImage(imageUrl);
      } catch (err) {
        console.warn("Failed to delete image from ImageKit:", err);
        setImageError("Unable to delete remote image. Please try again.");
      }
    }
  };

  const handleCategorySelect = (name) => {
    setForm((prev) => ({
      ...prev,
      category: name,
    }));
  };

  const handleAmenityToggle = (id) => {
    setForm((prev) => {
      const amenities = Array.isArray(prev.amenities) ? prev.amenities : [];
      return {
        ...prev,
        amenities: amenities.includes(id)
          ? amenities.filter((item) => item !== id)
          : [...amenities, id],
      };
    });
  };

  const handleUploadFiles = async (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;

    setUploadingImages(true);
    setImageError('');
    setValidationError('');

    try {
      const uploadedUrls = await uploadImages(files, '/staynest/listings/edit');
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      setImageError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImages(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setValidationError('');

    const validationMessage = validateForm();
    if (validationMessage) {
      setValidationError(validationMessage);
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        guests: Number(form.guests),
        beds: Number(form.beds),
        bathrooms: Number(form.bathrooms),
        images: listingPhotos,
        amenities: Array.isArray(form.amenities)
          ? form.amenities.map((amenity) => amenityIdToName[amenity] || amenity)
          : [],
        bedrooms: Array.isArray(form.bedrooms)
          ? form.bedrooms.map((bedroom) => ({
              title: bedroom.title || 'Bedroom',
              beds: Number(bedroom.beds || 1),
              images: Array.isArray(bedroom.images) ? bedroom.images.filter((item) => typeof item === 'string' && item.trim()) : [],
            }))
          : [],
        location: {
          ...form.location,
          latitude: form.location.latitude === '' ? undefined : Number(form.location.latitude),
          longitude: form.location.longitude === '' ? undefined : Number(form.location.longitude),
        },
      };

      await apiUpdateListing(id, payload);
      setSuccessMessage('Listing updated successfully!');
      setSaving(false);
      setTimeout(() => navigate('/host'), 1400);
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
      setSaving(false);
    }
  };

  const handleMapUpdate = ({ latitude, longitude }) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude,
        longitude,
      },
    }));
  };

  const handleBedroomPhotoUpload = async (index, event) => {
    const selectedFiles = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (selectedFiles.length === 0) return;

    setImageError('');
    try {
      const uploadedUrls = await uploadImages(selectedFiles, '/staynest/listings/bedroom');
      setForm((prev) => {
        const nextBedrooms = Array.isArray(prev.bedrooms) ? [...prev.bedrooms] : [];
        nextBedrooms[index] = {
          ...nextBedrooms[index],
          title: nextBedrooms[index]?.title || `Bedroom ${index + 1}`,
          beds: nextBedrooms[index]?.beds || 1,
          images: [
            ...(Array.isArray(nextBedrooms[index]?.images) ? nextBedrooms[index].images : []),
            ...uploadedUrls,
          ],
        };
        return { ...prev, bedrooms: nextBedrooms };
      });
    } catch (err) {
      setImageError(err.message || 'Bedroom photo upload failed.');
    }
  };

  const handleRemoveBedroomPhoto = async (bedroomIndex, photoIndex) => {
    const bedroom = form.bedrooms?.[bedroomIndex];
    if (!Array.isArray(bedroom?.images) || bedroom.images.length <= 1) {
      setValidationError('Each bedroom must keep at least one photo. Add a new photo before deleting this one.');
      return;
    }
    setValidationError('');

    const imageUrl = bedroom.images[photoIndex];
    setForm((prev) => {
      const nextBedrooms = Array.isArray(prev.bedrooms) ? [...prev.bedrooms] : [];
      if (!nextBedrooms[bedroomIndex]) return prev;
      const nextImages = Array.isArray(nextBedrooms[bedroomIndex].images)
        ? nextBedrooms[bedroomIndex].images.filter((_, idx) => idx !== photoIndex)
        : [];
      nextBedrooms[bedroomIndex] = { ...nextBedrooms[bedroomIndex], images: nextImages };
      return { ...prev, bedrooms: nextBedrooms };
    });

    if (imageUrl) {
      try {
        await deleteImage(imageUrl);
      } catch (err) {
        console.warn("Failed to delete bedroom image from ImageKit:", err);
        setImageError("Unable to delete remote bedroom image. Please try again.");
      }
    }
  };

  const handleAddBedroom = () => {
    setForm((prev) => {
      const nextBedrooms = Array.isArray(prev.bedrooms) ? [...prev.bedrooms] : [];
      nextBedrooms.push({ title: `Bedroom ${nextBedrooms.length + 1}`, beds: 1, images: [] });
      return { ...prev, bedrooms: nextBedrooms };
    });
  };

  const handleRemoveBedroom = (index) => {
    setForm((prev) => {
      const nextBedrooms = Array.isArray(prev.bedrooms) ? prev.bedrooms.filter((_, idx) => idx !== index) : [];
      return { ...prev, bedrooms: nextBedrooms };
    });
  };

  const mapLatitude = form.location.latitude === '' || form.location.latitude === undefined ? undefined : Number(form.location.latitude);
  const mapLongitude = form.location.longitude === '' || form.location.longitude === undefined ? undefined : Number(form.location.longitude);
  const hasListingLocation = mapLatitude !== undefined && mapLongitude !== undefined && !Number.isNaN(mapLatitude) && !Number.isNaN(mapLongitude);

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;

    setDeleting(true);
    setError('');

    try {
      await apiDeleteListing(id);
      navigate('/host');
    } catch (err) {
      setError(err.message || 'Failed to delete listing.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Navbar type="travelling" variant="host-dashboard" />
      <main className="px-8 md:px-16 py-12">
        <div className="max-w-4xl mx-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link to="/host" className="text-sm font-semibold text-[#FF385C] hover:underline">
                ← Back to listings
              </Link>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">Edit listing</h1>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? 'Deleting...' : 'Delete listing'}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {successMessage ? (
            <div className="fixed right-6 top-6 z-50 rounded-3xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800 shadow-lg dark:border-green-700 dark:bg-green-950/95 dark:text-green-200">
              <div className="font-semibold">Success</div>
              <div className="mt-1">{successMessage}</div>
            </div>
          ) : null}
          {validationError ? (
            <div className="fixed right-6 top-24 z-50 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-lg dark:border-red-700 dark:bg-red-950/95 dark:text-red-200">
              <div className="font-semibold">Validation error</div>
              <div className="mt-1">{validationError}</div>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-8 text-sm text-gray-600 dark:text-gray-300">Loading listing...</div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Category</label>
                  <div className="mt-3 max-h-[300px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {categories.map((category) => {
                        const selected = form.category === category.name;
                        return (
                          <button
                            type="button"
                            key={category.id}
                            onClick={() => handleCategorySelect(category.name)}
                            className={`text-left rounded-xl border p-3 transition-all ${
                              selected
                                ? 'border-[#FF385C] border-2 bg-rose-50 dark:bg-gray-800 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <i className={`fa-solid ${category.icon} text-xl text-gray-800 dark:text-gray-200`} />
                            <div className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{category.name}</div>
                            {selected && (
                              <span className="mt-2 inline-flex items-center gap-1 text-[#FF385C] text-xs font-semibold">
                                <i className="fa-solid fa-check" /> Selected
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Price / night</label>
                  <input
                    name="pricePerNight"
                    type="number"
                    min="0"
                    value={form.pricePerNight}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Guests</label>
                  <input
                    name="guests"
                    type="number"
                    min="1"
                    value={form.guests}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Beds</label>
                  <input
                    name="beds"
                    type="number"
                    min="1"
                    value={form.beds}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Bathrooms</label>
                  <input
                    name="bathrooms"
                    type="number"
                    min="1"
                    value={form.bathrooms}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Select amenities</label>
                  <div className="mt-3 max-h-[420px] overflow-y-auto pr-2">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries({
                        basics: 'Basics',
                        popular: 'Popular',
                        location: 'Location',
                        safety: 'Safety',
                      }).map(([categoryKey, label]) => {
                        const items = availableAmenities[categoryKey] || [];
                        return (
                          <div key={categoryKey}>
                            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {items.map((item) => {
                                const selected = Array.isArray(form.amenities) && form.amenities.includes(item.id);
                                return (
                                  <button
                                    type="button"
                                    key={item.id}
                                    onClick={() => handleAmenityToggle(item.id)}
                                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs transition-all ${
                                      selected
                                        ? 'border-[#FF385C] border-2 bg-rose-50 dark:bg-gray-800 shadow-sm'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                  >
                                    <i className={`${item.icon} text-sm text-gray-700 dark:text-gray-200`} />
                                    <span className="text-gray-900 dark:text-white">{item.name}</span>
                                    {selected && (
                                      <span className="ml-auto text-[#FF385C]">
                                        <i className="fa-solid fa-check" />
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Upload images</label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImages}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#FF385C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#e11a3d] disabled:opacity-60"
                    >
                      {uploadingImages ? 'Uploading…' : 'Upload photos'}
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Add one or more photos from your device.</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleUploadFiles}
                    />
                  </div>
                  {Array.isArray(form.images) && form.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {form.images.map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
                          <img src={image} alt={`Listing photo ${index + 1}`} className="h-40 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-gray-900 shadow-sm transition hover:bg-white dark:bg-gray-950/90 dark:text-white"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {imageError && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                      {imageError}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bedroom photos</h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Upload and remove bedroom photos for each bedroom.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBedroom}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Add bedroom
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {form.bedrooms.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        No bedroom photo groups yet. Add a bedroom to start uploading photos.
                      </div>
                    ) : (
                      form.bedrooms.map((bedroom, index) => (
                        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{bedroom.title || `Bedroom ${index + 1}`}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{Array.isArray(bedroom.images) ? bedroom.images.length : 0} photo{bedroom.images?.length === 1 ? '' : 's'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => bedroomInputRefs.current[index]?.click()}
                                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                              >
                                Upload
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveBedroom(index)}
                                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <input
                            ref={(element) => {
                              bedroomInputRefs.current[index] = element;
                            }}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => handleBedroomPhotoUpload(index, event)}
                          />
                          {Array.isArray(bedroom.images) && bedroom.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              {bedroom.images.map((image, photoIndex) => (
                                <div key={photoIndex} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-950">
                                  <img src={image} alt={`Bedroom ${index + 1} photo ${photoIndex + 1}`} className="h-36 w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBedroomPhoto(index, photoIndex)}
                                    className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-gray-900 shadow-sm transition hover:bg-white dark:bg-gray-950/90 dark:text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Address</label>
                  <input
                    name="location.address"
                    value={form.location.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">City</label>
                  <input
                    name="location.city"
                    value={form.location.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">State</label>
                  <input
                    name="location.state"
                    value={form.location.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Country</label>
                  <input
                    name="location.country"
                    value={form.location.country}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Latitude</label>
                  <input
                    name="location.latitude"
                    type="number"
                    value={form.location.latitude}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Longitude</label>
                  <input
                    name="location.longitude"
                    type="number"
                    value={form.location.longitude}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#FF385C] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Adjust location</label>
                <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                  <MapboxMap
                    latitude={hasListingLocation ? mapLatitude : 20.5937}
                    longitude={hasListingLocation ? mapLongitude : 78.9629}
                    draggable={false}
                    disableMapClickMove={true}
                    onMapDoubleClick={handleMapUpdate}
                    zoom={hasListingLocation ? 12 : 4}
                    className="w-full h-[420px]"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Double-click on the map to update the listing location. The map preloads the saved coordinates if available.
                </p>
              </div>

              <div className="space-y-3">
                {validationError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                    {validationError}
                  </div>
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Minimum 5 listing photos, at least 4 amenities, and at least one photo per bedroom are required.
                  </p>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-[#FF385C] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
