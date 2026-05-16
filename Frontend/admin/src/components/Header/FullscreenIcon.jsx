// =========================
// FullscreenIcon.jsx
// =========================

import { FiMaximize } from "react-icons/fi";
import { useState } from "react";

const FullscreenIcon = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      elem.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="header-icon" onClick={toggleFullscreen}>
      <FiMaximize />
    </div>
  );
};

export default FullscreenIcon;