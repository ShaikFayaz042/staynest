import  { useState, useEffect, useRef } from "react";

import StayNestLogo from "../../assets/logos/StayNestLogo";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

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

  return (
    <div className="relative w-full">
      <nav className="w-full h-16 md:h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 bg-white sticky top-0 z-50">
        {/* 1. Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0">
          {/* Use the Component Here */}
          <StayNestLogo theme="light" width={40} height={45} />

          <span className="text-2xl font-bold tracking-tight">
            Stay<span className="text-[#FF385C]">Nest</span>
          </span>
        </div>

        {/* 2. Search Bar Section (Center) - Hides on Mobile */}
        <SearchBar />

        {/* 3. Right Side Options (Right) - Hides on Mobile */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Dark Mode Toggle */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center border border-transparent hover:border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          </button>
          {/* Switch to hosting */}
          <button className="text-sm font-medium text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors hidden lg:block">
            Switch to hosting
          </button>

          {/* Profile circle "S" */}
          <button className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center hover:ring-2 hover:ring-emerald-200 transition">
            S
          </button>

          {/* Hamburger with dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:shadow-md transition-shadow flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-gray-700"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 18h16.5" />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                <ProfileMenuItem icon="heart" label="Wishlists" />
                <ProfileMenuItem icon="airbnb" label="Trips" />
                <ProfileMenuItem icon="message" label="Messages" />
                <ProfileMenuItem icon="profile" label="Profile" />
                <div className="h-px bg-gray-100 my-2" />
                <ProfileMenuItem icon="bell" label="Notifications" />
                <ProfileMenuItem icon="settings" label="Account settings" />
                <ProfileMenuItem icon="globe" label="Languages & currency" />
                <ProfileMenuItem icon="help" label="Help Centre" />
                <div className="h-px bg-gray-100 my-2" />
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Become a host</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      It's easy to start hosting and earn extra income.
                    </div>
                  </div>
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center text-2xl">🧑‍💼</div>
                </button>
                <div className="h-px bg-gray-100 my-2" />
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                  Refer a host
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                  Find a co-host
                </button>
                <div className="h-px bg-gray-100 my-2" />
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. Mobile Menu Button (Only visible on small screens) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors relative z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 18h16.5" />
          </svg>
        </button>
      </nav>

      {/* 5. Mobile Menu Dropdown (Mobile & Tablet < md) */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-40 ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          <div className="flex flex-col space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <button className="text-left px-3 py-2 hover:bg-white rounded-md transition-colors">
              <div className="text-xs font-bold text-gray-900">Where</div>
              <div className="text-sm text-gray-500">Search destinations</div>
            </button>
            <div className="h-px w-full bg-gray-200"></div>
            <button className="text-left px-3 py-2 hover:bg-white rounded-md transition-colors">
              <div className="text-xs font-bold text-gray-900">When</div>
              <div className="text-sm text-gray-500">Add dates</div>
            </button>
            <div className="h-px w-full bg-gray-200"></div>
            <div className="flex items-center justify-between px-3 py-2">
              <div>
                <div className="text-xs font-bold text-gray-900">Who</div>
                <div className="text-sm text-gray-500">Add guests</div>
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

          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
            <button className="text-left font-medium text-gray-800 px-3 py-3 hover:bg-gray-100 rounded-md transition-colors">
              Nest Your Home
            </button>
            <button className="flex items-center justify-between px-3 py-3 hover:bg-gray-100 rounded-md transition-colors">
              <span className="font-medium text-gray-800">Dark mode</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Mobile Overlay (Clicking outside closes menu) */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30 top-16"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

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
  message: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
    />
  ),
  profile: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  ),
  bell: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    />
  ),
  settings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
    />
  ),
  globe: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
    />
  ),
  help: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  ),
};

function ProfileMenuItem({ icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-gray-800"
      >
        {paths[icon]}
      </svg>
      <span className="text-sm text-gray-900">{label}</span>
    </button>
  );
}
