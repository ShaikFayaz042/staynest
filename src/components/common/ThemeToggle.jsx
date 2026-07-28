import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`
        group relative flex h-9 w-18 cursor-pointer items-center rounded-full p-1 border border-transparent
        transition-all duration-500 ease-in-out focus:outline-none focus-visible:shadow-[0_0_0_2px_rgba(125,211,252,0.45)]
        hover:shadow-[0_0_0_1.5px_rgba(125,211,252,0.45)] dark:hover:shadow-[0_0_0_1.5px_rgba(125,211,252,0.6)]
        ${isDark ? "bg-zinc-800 shadow-inner shadow-black/20" : "bg-[#fef2f6] shadow-inner shadow-[#FF385C]/10"}
      `}
    >
      {/* Background Decor: Light mode "Clouds" / Dark mode "Stars" */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <div
          className={`absolute h-full w-full transition-transform duration-700 ease-in-out ${
            isDark ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {/* Stars */}
          <span className="absolute left-3 top-2 h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_2px_1px_rgba(255,255,255,0.4)]"></span>
          <span className="absolute left-6 top-5 h-[1.5px] w-[1.5px] rounded-full bg-white opacity-60"></span>
          <span className="absolute left-8 top-1.5 h-0.5 w-0.5 rounded-full bg-white opacity-80"></span>
        </div>
      </div>

      {/* The Toggle Thumb (Sliding Circle) */}
      <div
        className={`
          relative flex h-7 w-7 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)]
          transition-transform duration-500 cubic-bezier(.34,1.56,.64,1)
          ${
            isDark
              ? "translate-x-9 bg-zinc-900"
              : "translate-x-0 bg-white"
          }
        `}
        style={{
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" // Custom bouncy spring effect
        }}
      >
        {/* Moon & Sun Icons container (Relative for overlap) */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
          
          {/* Moon Icon */}
          <svg
            className={`
              absolute h-5 w-5 text-indigo-200 transition-all duration-500 ease-in-out
              ${isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}
            `}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
            />
          </svg>

          {/* Sun Icon */}
          <svg
            className={`
              absolute h-5 w-5 text-amber-500 transition-all duration-500 ease-in-out
              ${isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}
            `}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </div>
      </div>
    </button>
  );
}