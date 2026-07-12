import { FiX } from "react-icons/fi";
import "../../assets/style/settings-drawer.css";

const RightSidebarSettings = ({ open, onClose, children }) => {
  return (
    <div className={`right-sidebar-settings ${open ? "open" : ""}`}>
      
      {/* Overlay */}
      <div
        className="right-sidebar-settings-overlay"
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <div className="right-sidebar-settings-panel">

        {/* Header */}
        <div className="right-sidebar-settings-header">
          <h3>Settings</h3>
          <FiX onClick={onClose} />
        </div>

        {/* Body */}
        <div className="right-sidebar-settings-body">
          {children}
        </div>

      </div>
    </div>
  );
};

export default RightSidebarSettings;