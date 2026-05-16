// components/CommonModal.jsx

import { FiX } from "react-icons/fi";
import "../../assets/style/CommonModal.css";
import "../../assets/style/SearchModal.css"

const CommonModal = ({
  isOpen,
  onClose,
  children,
  width = "600px",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="common-modal"
        style={{ width }}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <FiX />
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default CommonModal;