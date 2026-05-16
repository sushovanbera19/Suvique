import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

import "../../assets/style/Header.css";

const Header = ({
  collapsed,
  setCollapsed,
}) => {
  return (
    <header className="header">

      <HeaderLeft
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <HeaderRight />

    </header>
  );
};

export default Header;