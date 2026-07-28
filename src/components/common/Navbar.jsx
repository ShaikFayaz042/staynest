import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StayNestLogo from "../../assets/logos/StayNestLogo";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle"; // ✅ imported ThemeToggle
// import { ThemeContext } from "../../context/ThemeContext";
export default function Navbar({
  type = "hosting",
  variant = "default", // 'default' | 'host-dashboard' | 'profile' | 'auth'
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = () => {
    if (type === "hosting") {
      navigate("/host");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  // Check if user has any listings
  const userListings = user
    ? (JSON.parse(localStorage.getItem("listings")) || []).filter(l => l.hostId === user.id)
    : [];
  const hasListings = userListings.length > 0;

  // Determine which tab is active for sub-navs
  const path = location.pathname;

  // Determine home path based on current route
  const homePath = path.startsWith("/host") ? "/host" : "/";

  // Host dashboard tabs
  const hostTabs = [
    { label: "Listings", path: "/host" },
    { label: "Calendar" },
    { label: "Messages" },
  ];

  // Profile sub-nav tabs
  const profileTabs = [
    { label: "My Trips", path: "/trips" },
    { label: "Wishlists", path: "/wishlists" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <div className="relative w-full">
      <nav className="w-full h-16 md:h-20 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-gray-900 sticky top-0 z-50">
        {/* 1. Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          <StayNestLogo width={40} height={45} />
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Stay<span className="text-[#FF385C]">Nest</span>
          </span>
        </div>

        {/* 2. Center Section (Search Bar or Tabs based on variant) */}
        <div className="flex-1 flex justify-center hidden md:flex">
          {variant === "default" && <SearchBar />}

          {variant === "host-dashboard" && (
            <div className="flex items-center gap-6">
              {hostTabs.map((tab, index) => {
                let isActive = path === tab.path;
                if (
                  index === 0 &&
                  path.startsWith("/host") &&
                  !hostTabs.some((t, i) => i !== 0 && t.path && path.includes(t.path))
                ) {
                  isActive = true;
                }

                return (
                  <button
                    key={tab.label}
                    onClick={() => tab.path && navigate(tab.path)}
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors mt-1 ${
                      isActive
                        ? "border-black dark:border-white text-black dark:text-white"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {variant === "profile" && (
            <div className="flex items-center gap-6">
              {profileTabs.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`text-sm font-medium pb-1 border-b-2 transition-colors mt-1 ${
                    path === tab.path
                      ? "border-black dark:border-white text-black dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {variant === "auth" && <div />} {/* empty center */}
        </div>

        {/* 3. Right Side Options */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Dark Mode Toggle */}
          <ThemeToggle />

          {/* Switch button - only for default & host-dashboard */}
          {(variant === "default" || variant === "host-dashboard") && (
            <button
              onClick={handleSwitch}
              className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-full transition-colors hidden lg:block"
            >
              {variant === "default" && !user ? "Nest Your Home" : ` Switch to ${type}`}
            </button>
          )}

          {/* Profile circle - show only if logged in and not in auth variant */}
          {user && variant !== "auth" && (
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 font-semibold flex items-center justify-center hover:ring-2 hover:ring-rose-200 dark:hover:ring-rose-500/50 transition overflow-hidden"
            >
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitial
              )}
            </button>
          )}

          {/* Hamburger with dropdown - show only if not in auth variant */}
          {variant !== "auth" && (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-700 dark:text-gray-300"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 18h16.5" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden">
                  {user ? (
                    <>
                      {/* Home - visible only when NOT on / or /host */}
                      {path !== "/" && path !== "/host" && (
                        <>
                          <ProfileMenuItem
                            icon="home"
                            label="Home"
                            onClick={() => { navigate(homePath); setIsProfileMenuOpen(false); }}
                          />
                          <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
                        </>
                      )}

                      <ProfileMenuItem
                        icon="heart"
                        label="Wishlists"
                        onClick={() => { navigate("/wishlists"); setIsProfileMenuOpen(false); }}
                      />
                      <ProfileMenuItem
                        icon="airbnb"
                        label="Trips"
                        onClick={() => { navigate("/trips"); setIsProfileMenuOpen(false); }}
                      />
                      <ProfileMenuItem
                        icon="profile"
                        label="Profile"
                        onClick={() => { navigate("/profile"); setIsProfileMenuOpen(false); }}
                      />

                      {/* "Become a Host" - only if user has no listings */}
                      {!hasListings && (
                        <>
                          <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
                          <ProfileMenuItem
                            icon="home"
                            label="Become a Host"
                            onClick={() => { navigate("/host/create"); setIsProfileMenuOpen(false); }}
                          />
                        </>
                      )}

                      <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
                      <ProfileMenuItem
                        icon="logout"
                        label="Log out"
                        onClick={handleLogout}
                      />
                    </>
                  ) : (
                    <>
                      <ProfileMenuItem
                        icon="login"
                        label="Log in"
                        onClick={() => { navigate("/login"); setIsProfileMenuOpen(false); }}
                      />
                      <ProfileMenuItem
                        icon="signup"
                        label="Sign up"
                        onClick={() => { navigate("/signup"); setIsProfileMenuOpen(false); }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Mobile Menu Button (Only visible on small screens and not in auth variant) */}
        {variant !== "auth" && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-800 dark:text-gray-200"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 18h16.5" />
            </svg>
          </button>
        )}
      </nav>

      {/* 5. Mobile Menu Dropdown (Mobile & Tablet < md) */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-40 ${
          isMobileMenuOpen ? "max-h-125 opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          <div className="flex flex-col space-y-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
            <button className="text-left px-3 py-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">
              <div className="text-xs font-bold text-gray-900 dark:text-white">Where</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Search destinations</div>
            </button>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <button className="text-left px-3 py-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">
              <div className="text-xs font-bold text-gray-900 dark:text-white">When</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Add dates</div>
            </button>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center justify-between px-3 py-2">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Who</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Add guests</div>
              </div>
              <button className="bg-[#FF385C] text-white rounded-full p-2 hover:bg-[#d90b35] transition-colors shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button className="text-left font-medium text-gray-800 dark:text-gray-200 px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              Nest Your Home
            </button>
            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              <span className="font-medium text-gray-800 dark:text-gray-200">Dark mode</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Mobile Overlay (Clicking outside closes menu) */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/40 z-30 top-16"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

// SVG paths for icons 
const paths = {
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  ),
  airbnb: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l9 15.5a3.5 3.5 0 01-6.062 3.5L12 17l-2.938 5a3.5 3.5 0 01-6.062-3.5L12 3z"
    />
  ),
  profile: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  ),
  logout: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
      />
    </>
  ),
  login: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
    />
  ),
  signup: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
    />
  ),
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  ),
};

function ProfileMenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-gray-800 dark:text-gray-200"
      >
        {paths[icon]}
      </svg>
      <span className="text-sm text-gray-900 dark:text-gray-100">{label}</span>
    </button>
  );
}