import { FiSettings } from "react-icons/fi";

const SettingsIcon = ({ onClick }) => {
  return (
    <div
      className="header-icon settings-rotate"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <FiSettings />
    </div>
  );
};

export default SettingsIcon;