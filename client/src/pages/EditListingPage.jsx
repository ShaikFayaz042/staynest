import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MapboxMap from '../components/common/MapboxMap';
import { uploadImages } from '../api/imagekit';
import { fetchListingById, updateListing as apiUpdateListing, deleteListing as apiDeleteListing } from '../api/listings';
import categories from '../data/categories';
import amenitiesData from '../data/amenities';

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
  const [imageError, setImageError] = useState('');
  const [availableAmenities] = useState(amenitiesData);
  const fileInputRef = useRef(null);

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
          amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
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

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

    try {
      const payload = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        guests: Number(form.guests),
        beds: Number(form.beds),
        bathrooms: Number(form.bathrooms),
        images: Array.isArray(form.images)
          ? form.images.filter((item) => typeof item === 'string' && item.trim())
          : [],
        location: {
          ...form.location,
          latitude: form.location.latitude === '' ? undefined : Number(form.location.latitude),
          longitude: form.location.longitude === '' ? undefined : Number(form.location.longitude),
        },
      };

      await apiUpdateListing(id, payload);
      navigate('/host');
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleMapDrag = ({ latitude, longitude }) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude,
        longitude,
      },
    }));
  };

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
                  {imageError && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                      {imageError}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {form.images.map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        <img src={image} alt={`Listing preview ${index + 1}`} className="h-40 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm transition hover:bg-white dark:bg-gray-950/90 dark:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
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
                    latitude={Number(form.location.latitude) || 20.5937}
                    longitude={Number(form.location.longitude) || 78.9629}
                    draggable={true}
                    disableMapClickMove={true}
                    onDragEnd={handleMapDrag}
                    zoom={12}
                    className="w-full h-[420px]"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Drag the pin to update the listing location. Click outside the pin to recenter the map.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#FF385C] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
