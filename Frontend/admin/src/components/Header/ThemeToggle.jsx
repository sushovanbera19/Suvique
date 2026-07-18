import { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("adminDarkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("adminDarkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Apply on initial mount
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <div
      className="header-icon"
      onClick={() => setDarkMode(!darkMode)}
      style={{ cursor: "pointer" }}
    >
      {darkMode ? <FiSun /> : <FiMoon />}
    </div>
  );
};

export default ThemeToggle;
