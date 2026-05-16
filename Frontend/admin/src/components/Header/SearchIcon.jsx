import { useState } from "react";
import {
  FiSearch,
  FiMic,
  FiMoreVertical,
} from "react-icons/fi";

import CommonModal from "../common/CommonModal";
// import "../../assets/style/SearchModal.css";
const SearchIcon = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Search Icon */}
      <div className="header-icon" onClick={() => setOpen(true)}>
        <FiSearch />
      </div>

      {/* Reusable Modal */}
      <CommonModal
        isOpen={open}
        onClose={() => setOpen(false)}
        width="600px"
      >
        {/* Search Input */}
        <div className="search-input-box">
          <FiSearch className="search-icon" />

          <input type="text" placeholder="Search" />

          <FiMic className="mic-icon" />
          <FiMoreVertical className="more-icon" />
        </div>

        {/* Filters */}
        <div className="search-tags">
          <button>People ✕</button>
          <button>Pages ✕</button>
          <button>Articles ✕</button>
          <button>Tags ✕</button>
        </div>

        {/* Recent Searches */}
        <div className="recent-section">
          <h4>Recent Search :</h4>

          <div className="recent-item">Notifications</div>
          <div className="recent-item">Alerts</div>
          <div className="recent-item">Mail</div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="search-btn">Search</button>

          <button className="clear-btn">
            Clear Recents
          </button>
        </div>
      </CommonModal>
    </>
  );
};

export default SearchIcon;