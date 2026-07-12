import { useState } from "react";

import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import RightSidebarSettings from "../common/RightSidebarSettings";
import Settings from "../Dashboard/Settings";

import "../../assets/style/Header.css";

const Header = ({ collapsed, setCollapsed }) => {

  // ✅ STATE FOR SETTINGS SIDEBAR
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="header">

        <HeaderLeft
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* ✅ PASS CLICK HANDLER TO OPEN SETTINGS */}
        <HeaderRight onSettingsClick={() => setSettingsOpen(true)} />

      </header>

      {/* ✅ RIGHT SIDE SETTINGS DRAWER */}
      <RightSidebarSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <Settings />
      </RightSidebarSettings>
    </>
  );
};

export default Header;