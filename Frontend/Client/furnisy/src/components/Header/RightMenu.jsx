import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";
import CartSidebar from "./CartSidebar";



const RightMenu = ({ rightMenuItems, openSearchModal }) => {
    const [openRightMenu, setOpenRightMenu] = useState(null);
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };
    

    
    return (
        <>
            <nav className="right-menu">
                <ul>
                    <li className="search-item">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={openSearchModal} />
                    </li>
                    {
                        rightMenuItems.map((item, index) => (
                            <li key={index} className={
                                item.subMenu
                                    ?
                                    "has-dropdown"
                                    :
                                    ""
                            }
                                onMouseEnter={() =>
                                    item.subMenu &&
                                    setOpenRightMenu(item.name)
                                }
                                onMouseLeave={() =>
                                    setOpenRightMenu(null)}>
                                {
                                    item.flag &&
                                    <img src={item.flag} className="currency-flag" alt="flag" />
                                }
                                {
                                    item.img && item.path ? (

                                        item.path === "/login" ? (

                                            token && user ? (
                                                <div
                                                    className="profile-wrapper"
                                                    onMouseEnter={() => setOpenRightMenu("profile")}
                                                    onMouseLeave={() => setOpenRightMenu(null)}
                                                >
                                                    <img
                                                        src={
                                                            user.profileImage ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                user.name || "User"
                                                            )}`
                                                        }
                                                        className="right-icon-image profile-image"
                                                        alt="profile"
                                                    />

                                                    {openRightMenu === "profile" && (
                                                        <div className="profile-dropdown">
                                                            <Link to="/profile">
                                                                Profile
                                                            </Link>

                                                            <button onClick={handleLogout}>
                                                                Logout
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link to="/login">
                                                    <img
                                                        src={item.img}
                                                        className="right-icon-image"
                                                        alt="login"
                                                    />
                                                </Link>
                                            )

                                        ) : item.path === "/cart" ? (

                                            <img
                                                src={item.img}
                                                className="right-icon-image cart-icon"
                                                alt="cart"
                                                onClick={() => setCartSidebarOpen(true)}
                                            />

                                        ) : (

                                            <Link to={item.path}>
                                                <img
                                                    src={item.img}
                                                    className="right-icon-image"
                                                    alt="icon"
                                                />
                                            </Link>

                                        )

                                    ) : (
                                        item.name
                                    )
                                }
                                {
                                    item.subMenu &&
                                    <FontAwesomeIcon icon={faAngleDown} className="arrow" />
                                }
                                {
                                    item.subMenu &&
                                    openRightMenu === item.name &&
                                    <Dropdown items={item.subMenu} />}
                            </li>
                        ))
                    }
                </ul>
            </nav>
            <CartSidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />
        </>
    );
};


export default RightMenu;