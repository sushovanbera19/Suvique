import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiFileText, FiCheckSquare, FiShield, FiAlertTriangle, FiChevronRight, FiChevronDown, FiBox, FiLayers, FiLayout, FiPieChart, FiBriefcase, FiImage, FiTrendingUp, FiBarChart2, FiFolder, FiUsers, FiActivity, FiBookOpen, FiUser, FiGrid, FiMapPin, FiStar, FiCreditCard, FiPackage, FiSettings, } from "react-icons/fi";
import "../../assets/style/Sidebar.css";

const Sidebar = ({ collapsed }) => {

  const [active, setActive] = useState("Ecommerce");
  const [openMenu, setOpenMenu] = useState("Dashboards");
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  // functions 
  const toggleSubMenu = (name) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const menuData = [
    // ================= MAIN =================
    {
      section: "MAIN",
      menus: [
        {
          title: "Dashboards",
          icon: <FiHome />,
          badge: "12",

          children: [
            {
              name: "Overview",
              icon: <FiLayout />,
              path: "/dashboard/overview",
            },

            {
              name: "Sales",
              icon: <FiTrendingUp />,
              path: "/dashboard/sales",
            },

            {
              name: "Orders",
              icon: <FiPackage />,
              path: "/dashboard/orders",
            },

            {
              name: "Products",
              icon: <FiBox />,
              path: "/dashboard/products",
            },
            {
              name: "Customers",
              icon: <FiUsers />,
              path: "/dashboard/customers",
            },

            {
              name: "Analytics",
              icon: <FiBarChart2 />,
              path: "/dashboard/analytics",
            },

            {
              name: "Marketing",
              icon: <FiPieChart />,
              path: "/dashboard/marketing",
            },

            {
              name: "Finance",
              icon: <FiCreditCard />,
              path: "/dashboard/finance",
            },

            {
              name: "Variations",
              icon: <FiActivity />,
              path: "/dashboard/inventory",
            },

            {
              name: "Vendors",
              icon: <FiBriefcase />,
              path: "/dashboard/vendors",
            },

            {
              name: "Support",
              icon: <FiBookOpen />,
              path: "/dashboard/support",
            },

            {
              name: "Settings",
              icon: <FiSettings />,
              path: "/dashboard/settings",
            },
          ],
        },
      ],
    },
    // ================= CATEGORY MANAGEMENT =================
    {
      section: "CATEGORY MANAGEMENT",

      menus: [
        {
          title: "Category",
          icon: <FiFolder />,

          children: [
            {
              name: "Category List",
              path: "/dashboard/categories",
            },
            {
              name: "Add Category",
              path: "/dashboard/categories/create",
            },
          ],
        },

        {
          title: "Sub Category",
          icon: <FiLayers />,

          children: [
            {
              name: "Sub Category List",
              path: "/dashboard/sub-categories",
            },
            {
              name: "Add Sub Category",
              path: "/dashboard/sub-categories/create",
            },
          ],
        },
      ],
    },

    // ================= PAGES =================
    {
      section: "PAGES",

      menus: [
        {
          title: "Pages",
          icon: <FiFileText />,
          badge: "New",

          children: [
            { name: "About Us" },

            {
              name: "Blog",

              children: [
                { name: "Blog" },
                { name: "Blog Details" },
                { name: "Create Blog" },
              ],
            },

            { name: "Chat" },
            { name: "Contacts" },
            { name: "Contact Us" },

            {
              name: "Ecommerce",

              children: [
                { name: "Shop" },
                { name: "Product Details" },
                { name: "Cart" },
              ],
            },

            {
              name: "Email",

              children: [
                { name: "Inbox" },
                { name: "Read Mail" },
              ],
            },

            { name: "Empty" },
            { name: "FAQ's" },

            {
              name: "File Manager",

              children: [
                { name: "Files" },
                { name: "Recent Files" },
              ],
            },

            {
              name: "Invoice",

              children: [
                { name: "Invoice List" },
                { name: "Invoice Details" },
              ],
            },

            { name: "Landing" },
            { name: "Jobs Landing" },
          ],
        },

        {
          title: "Task",
          icon: <FiCheckSquare />,
          badge: "New",

          children: [
            { name: "Task List" },
            { name: "Task Details" },
            { name: "Create Task" },
          ],
        },

        {
          title: "Authentication",
          icon: <FiShield />,

          children: [
            { name: "Login", path: "/" },
            { name: "Register", path: "/signup" },
            { name: "Forgot Password" },
          ],
        },

        {
          title: "Error",
          icon: <FiAlertTriangle />,

          children: [
            { name: "404 Error" },
            { name: "500 Error" },
          ],
        },
      ],
    },


    // ================= GENERAL =================
    {
      section: "GENERAL",

      menus: [
        {
          title: "UI Elements",
          icon: <FiBox />,

          children: [
            { name: "Buttons" },
            { name: "Cards" },
            { name: "Modal" },
          ],
        },

        {
          title: "Utilities",
          icon: <FiActivity />,

          children: [
            { name: "Colors" },
            { name: "Borders" },
            { name: "Typography" },
          ],
        },

        {
          title: "Forms",
          icon: <FiFileText />,

          children: [
            { name: "Form Elements" },
            { name: "Form Validation" },
          ],
        },

        {
          title: "Advanced UI",
          icon: <FiLayers />,

          children: [
            { name: "Drag & Drop" },
            { name: "Range Slider" },
          ],
        },

        {
          title: "Widgets",
          icon: <FiPieChart />,
          badge: "Hot",

          children: [
            { name: "Statistics" },
            { name: "Charts Widget" },
          ],
        },
      ],
    },

    // ================= WEB APPS =================
    {
      section: "WEB APPS",

      menus: [
        {
          title: "Apps",
          icon: <FiGrid />,
          badge: "New",

          children: [
            { name: "Kanban" },
            { name: "Calendar" },
            { name: "Chat App" },
          ],
        },

        {
          title: "Nested Menu",
          icon: <FiLayers />,

          children: [
            {
              name: "Level 1",

              children: [
                { name: "Level 2" },
                { name: "Level 2.1" },
              ],
            },
          ],
        },
      ],
    },

    // ================= TABLES =================
    {
      section: "TABLES & CHARTS",

      menus: [
        {
          title: "Tables",
          icon: <FiGrid />,
          badge: "3",

          children: [
            { name: "Basic Tables" },
            { name: "Data Tables" },
          ],
        },

        {
          title: "Charts",
          icon: <FiBarChart2 />,

          children: [
            { name: "Apex Charts" },
            { name: "Chart JS" },
          ],
        },
      ],
    },

    // ================= MAPS =================
    {
      section: "MAPS & ICONS",

      menus: [
        {
          title: "Maps",
          icon: <FiMapPin />,

          children: [
            { name: "Google Maps" },
            { name: "Vector Maps" },
          ],
        },

        {
          title: "Icons",
          icon: <FiStar />,

          children: [
            { name: "Font Awesome" },
            { name: "Bootstrap Icons" },
          ],
        },
      ],
    },
  ];

  return (

    <div
      className={
        collapsed
          ? "sidebar collapsed"
          : "sidebar"
      }
    >
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>

        {!collapsed && (
          <h2>
            Y<span>nex</span>
          </h2>
        )}
      </div>

      {/* MENU */}
      <div className="sidebar-content">
        {menuData.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <p className="section-title">
                {section.section}
              </p>
            )}

            {section.menus.map((menu, i) => (
              <div key={i}>
                {/* PARENT */}
                <div
                  className={`menu-item ${openMenu === menu.title ? "active-parent" : ""
                    }`}
                  onClick={() =>
                    setOpenMenu(
                      openMenu === menu.title ? "" : menu.title
                    )
                  }
                >
                  <div className="menu-left">
                    <span className="menu-icon">{menu.icon}</span>

                    {!collapsed && (
                      <span className="menu-text">
                        {menu.title}
                      </span>
                    )}

                    {!collapsed && menu.badge && (
                      <span
                        className={
                          menu.badge === "New"
                            ? "badge-new"
                            : "badge-count"
                        }
                      >
                        {menu.badge}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <span className="arrow">
                      {openMenu === menu.title ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronRight />
                      )}
                    </span>
                  )}
                </div>

                {/* SUBMENU */}
                {openMenu === menu.title && menu.children && (
                  <ul className="submenu">
                    {menu.children.map((sub, index) => (
                      <li key={index}>
                        {/* SIMPLE ITEM */}
                        {!sub.children ? (
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              isActive
                                ? "submenu-item active-submenu"
                                : "submenu-item"
                            }
                          >
                            <span className="dot"></span>

                            {/* ICON */}
                            {sub.icon && (
                              <span className="menu-icon">{sub.icon}</span>
                            )}

                            {!collapsed && <span>{sub.name}</span>}
                          </NavLink>
                        ) : (
                          <>
                            {/* PARENT ITEM */}
                            <div
                              className="submenu-item"
                              onClick={() => toggleSubMenu(sub.name)}
                            >
                              <div className="submenu-left">
                                <span className="dot"></span>

                                {/* FIX 2: show icon */}
                                {sub.icon && (
                                  <span className="menu-icon">{sub.icon}</span>
                                )}

                                {!collapsed && <span>{sub.name}</span>}
                              </div>

                              {openSubMenus[sub.name] ? (
                                <FiChevronDown className="mini-arrow" />
                              ) : (
                                <FiChevronRight className="mini-arrow" />
                              )}
                            </div>

                            {/* NESTED */}
                            {openSubMenus[sub.name] && (
                              <ul className="nested-submenu">
                                {sub.children.map((nested, i) => (
                                  <li
                                    key={i}
                                    className={
                                      active === nested.name
                                        ? "nested-item nested-active"
                                        : "nested-item"
                                    }
                                    onClick={() => setActive(nested.name)}
                                  >
                                    <span className="dot"></span>
                                    {!collapsed && <span>{nested.name}</span>}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;