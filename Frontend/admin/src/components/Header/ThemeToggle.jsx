import { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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