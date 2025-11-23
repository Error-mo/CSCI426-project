import React from "react";

export default function DarkModeToggle({ isDarkMode, toggleDarkMode }) {
  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="toggle-icon">{isDarkMode ? "☀️" : "🌙"}</span>
    </button>
  );
}

