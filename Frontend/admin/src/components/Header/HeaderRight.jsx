// =========================
// HeaderRight.jsx
// =========================

import SearchIcon from "./SearchIcon";
import Language from "./Language";
import ThemeToggle from "./ThemeToggle";
import CartIcon from "./CartIcon";
import NotificationIcon from "./NotificationIcon";
import AppsIcon from "./AppsIcon";
import FullscreenIcon from "./FullscreenIcon";
import UserProfile from "./UserProfile";
import SettingsIcon from "./SettingsIcon";

const HeaderRight = () => {
  return (
    <div className="header-right">
      <SearchIcon />
      <Language />
      <ThemeToggle />
      <CartIcon />
      <NotificationIcon />
      <AppsIcon />
      <FullscreenIcon />
      <UserProfile />
      <SettingsIcon />
    </div>
  );
};

export default HeaderRight;