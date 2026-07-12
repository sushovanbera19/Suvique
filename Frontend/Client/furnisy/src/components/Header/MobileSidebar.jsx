import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";

const MobileSidebar = ({ open, menuItems, rightMenuItems, onClose }) => {
    const [active, setActive] = useState(null);
    const toggleMenu = (name) => {
        setActive(active === name ? null : name);
    };


    return (
        <>
            <div className={`sidebar-overlay ${open ? "active" : ""}`} onClick={onClose} />
            <div className={`mobile-sidebar ${open ? "open" : ""}`}>
                <div className="close-sidebar" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <div className="mobile-menu-title" onClick={() => (item.subMenu || item.megaMenu) && toggleMenu(item.name)}>
                                {
                                    item.path ?
                                        <Link to={item.path} onClick={onClose}>
                                            {item.name}
                                        </Link>
                                        :

                                        item.name
                                }
                                {
                                    (item.subMenu || item.megaMenu)
                                    &&
                                    <FontAwesomeIcon icon={faAngleDown} className={active === item.name ? "rotate"
                                        :
                                        ""
                                    }
                                    />
                                }
                            </div>
                            {
                                active === item.name &&

                                <ul className="sidebar-submenu open">
                                    {
                                        item.subMenu &&
                                        item.subMenu.map((sub, i) => (

                                            <li key={i}>

                                                <Link to={sub.path} onClick={onClose}>
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        ))
                                    }

                                    {
                                        item.megaMenu &&
                                        item.megaMenu.map((col, i) => (

                                            <li key={i}>

                                                {
                                                    col.title &&
                                                    <strong>
                                                        {col.title}
                                                    </strong>
                                                }


                                                {
                                                    col.links &&
                                                    <ul>

                                                        {
                                                            col.links.map((link, j) => (

                                                                <li key={j}>

                                                                    <Link
                                                                        to={link.path}
                                                                        onClick={onClose}
                                                                    >
                                                                        {link.label}
                                                                    </Link>

                                                                </li>

                                                            ))
                                                        }

                                                    </ul>
                                                }

                                            </li>
                                        ))
                                    }
                                </ul>
                            }
                        </li>
                    ))}
                    <hr />


                    {
                        rightMenuItems
                            .filter(item => item.subMenu)
                            .map((item, index) => (

                                <li key={index}>


                                    <div className="mobile-menu-title" onClick={() => toggleMenu(item.name)}>
                                        {item.name}
                                        <FontAwesomeIcon icon={faAngleDown} className={active === item.name ? "rotate"
                                            :
                                            ""
                                        }
                                        />

                                    </div>
                                    {
                                        active === item.name &&
                                        <ul className="sidebar-submenu open">
                                            {
                                                item.subMenu.map((sub, i) => (

                                                    <li key={i}>
                                                        {sub}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    }
                                </li>
                            ))
                    }
                </ul>
            </div>
        </>
    );
};


export default MobileSidebar;