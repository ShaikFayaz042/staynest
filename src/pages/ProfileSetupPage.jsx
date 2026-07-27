import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

export default function ProfileSetupPage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photo, setPhoto] = useState(user?.profilePhoto || "");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    if (!user) return;

    // Build the updated fields
    const updates = {
      name,
      about,
      profilePhoto: photo,
    };

    // Call context method – it will update both localStorage and context state
    updateUser(updates);

    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Nunito, sans-serif" }}>
      <Navbar type="travelling" variant="profile" />
      <main className="max-w-2xl mx-auto px-8 md:px-16 py-12">
        <h1 className="text-3xl font-extrabold">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Update your personal information</p>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>
        )}

        <div className="mt-8 space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-semibold mb-1">Profile Photo URL</label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
            />
            {photo && (
              <img src={photo} alt="Profile" className="mt-3 w-24 h-24 rounded-full object-cover" />
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* About Me */}
          <div>
            <label className="block text-sm font-semibold mb-1">About Me</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              placeholder="Tell us a bit about yourself..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
          >
            Save Changes
          </button>

          <hr className="my-8" />

          {/* Non-functional placeholders */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Account Settings</h3>
            <button className="mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Change Password
            </button>
            <button className="mt-2 ml-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}