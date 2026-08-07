import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

export default function ProfileSetupPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photo, setPhoto] = useState(user?.profilePhoto || "");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!user) return;

    const result = await updateUser({
      name,
      bio: about,
      profile: photo,
    });

    if (result.success) {
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(result.message || "Unable to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navbar type="travelling" variant="profile" />
      <main className="max-w-2xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Update your personal information</p>

        {message && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">{message}</div>
        )}

        <div className="mt-8 space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Profile Photo URL</label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {photo && (
              <img src={photo} alt="Profile" className="mt-3 w-24 h-24 rounded-full object-cover" />
            )}
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