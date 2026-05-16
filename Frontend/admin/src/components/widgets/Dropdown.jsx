// =========================
// Dropdown.jsx (Reusable)
// =========================

import { useState, useRef, useEffect } from "react";
import "../../assets/style/Dropdown.css"

const Dropdown = ({
  trigger,
  children,
  width = "260px",
  position = "right",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>

      {open && (
        <div
          className={`dropdown-menu ${position}`}
          style={{ width }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;