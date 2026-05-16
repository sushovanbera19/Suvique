import {
  FiMenu,
  FiX,
} from "react-icons/fi";

const HeaderLeft = ({
  collapsed,
  setCollapsed,
}) => {
  return (
    <div className="header-left">

      <button
        className="menu-btn"
        onClick={() =>
          setCollapsed(!collapsed)
        }
      >
        {collapsed ? <FiX /> : <FiMenu />}
      </button>

    </div>
  );
};

export default HeaderLeft;