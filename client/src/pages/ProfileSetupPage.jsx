import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import { uploadImages, deleteImage } from "../api/imagekit";
import { useToast } from "../context/ToastContext";

export default function ProfileSetupPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photo, setPhoto] = useState(user?.profilePhoto || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    if (!user) return;

    const result = await updateUser({
      name,
      bio: about,
      profile: photo,
      phone,
      address,
    });

    if (result.success) {
      showToast({ message: 'Profile updated successfully!', type: 'success' });
    } else {
      showToast({ message: result.message || "Unable to update profile.", type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navbar type="travelling" variant="profile" />
      <main className="max-w-2xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Update your personal information</p>

        

        <div className="mt-8 space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Profile Photo</label>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200">
                {uploading ? "Uploading..." : "Choose Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const urls = await uploadImages([file], "/staynest/profile");
                      if (urls && urls.length) setPhoto(urls[0]);
                    } catch (err) {
                      console.error("Upload failed", err);
                      showToast({ message: 'Image upload failed', type: 'error' });
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {photo && (
                <div className="flex items-center gap-3">
                  <img src={photo} alt="Profile" className="mt-3 w-24 h-24 rounded-full object-cover" />
                  <button
                    onClick={async () => {
                      try {
                        await deleteImage(photo);
                      } catch (err) {
                        console.error("Failed to delete image", err);
                      }
                      setPhoto("");
                    }}
                    className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* About Me */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">About Me</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              placeholder="Tell us a bit about yourself..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Save Changes
          </button>

          {/* Additional details: phone + address */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Location / Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Country or full address"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Account Settings</h3>
            <button className="mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              Change Password
            </button>
            <button className="mt-2 ml-4 px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}