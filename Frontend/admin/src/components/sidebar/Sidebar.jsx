import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiFileText, FiCheckSquare, FiShield, FiAlertTriangle, FiChevronRight, FiChevronDown, FiBox, FiLayers, FiLayout, FiPieChart, FiBriefcase, FiImage, FiTrendingUp, FiBarChart2, FiFolder, FiUsers, FiActivity, FiBookOpen, FiUser, FiGrid, FiMapPin, FiStar, FiCreditCard, FiPackage, FiSettings, } from "react-icons/fi";
import { useTranslation } from "../../hooks/useTranslation";
import "../../assets/style/Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState("Ecommerce");
  const [openMenu, setOpenMenu] = useState("Pages");
  const [openSubMenus, setOpenSubMenus] = useState({ "Blog": true, [t("sidebar.fileManager")]: true });

  const toggleSubMenu = (name) => {
    setOpenSubMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const menuData = [
    {
      section: t("sidebar.main"),
      menus: [
        {
          title: t("sidebar.dashboards"),
          icon: <FiHome />,
          badge: "12",
          children: [
            { name: t("sidebar.overview"), icon: <FiLayout />, path: "/dashboard/overview" },
            { name: t("sidebar.sales"), icon: <FiTrendingUp />, path: "/dashboard/sales" },
            { name: t("sidebar.orders"), icon: <FiPackage />, path: "/dashboard/orders" },
            { name: t("sidebar.products"), icon: <FiBox />, path: "/dashboard/products" },
            { name: t("sidebar.customers"), icon: <FiUsers />, path: "/dashboard/customers" },
            { name: t("sidebar.analytics"), icon: <FiBarChart2 />, path: "/dashboard/analytics" },
            { name: t("sidebar.marketing"), icon: <FiPieChart />, path: "/dashboard/marketing" },
            { name: t("sidebar.finance"), icon: <FiCreditCard />, path: "/dashboard/finance" },
            { name: t("sidebar.variations"), icon: <FiActivity />, path: "/dashboard/inventory" },
            { name: t("sidebar.vendors"), icon: <FiBriefcase />, path: "/dashboard/vendors" },
            { name: t("sidebar.support"), icon: <FiBookOpen />, path: "/dashboard/support" },
            { name: t("sidebar.settings"), icon: <FiSettings />, path: "/dashboard/settings" },
          ],
        },
      ],
    },
    {
      section: t("sidebar.categoryManagement"),
      menus: [
        {
          title: t("sidebar.category"),
          icon: <FiFolder />,
          children: [
            { name: t("sidebar.categoryList"), path: "/dashboard/categories" },
            { name: t("sidebar.addCategory"), path: "/dashboard/categories/create" },
          ],
        },
        {
          title: t("sidebar.subCategory"),
          icon: <FiLayers />,
          children: [
            { name: t("sidebar.subCategoryList"), path: "/dashboard/sub-categories" },
            { name: t("sidebar.addSubCategory"), path: "/dashboard/sub-categories/create" },
          ],
        },
      ],
    },
    {
      section: t("sidebar.pages"),
      menus: [
        {
          title: t("sidebar.pages"),
          icon: <FiFileText />,
          badge: t("sidebar.new"),
          children: [
            { name: t("sidebar.aboutUs"), path: "/dashboard/about-us" },
            { name: t("sidebar.staticPages"), path: "/dashboard/static-pages" },
            {
              name: t("sidebar.blog"),
              children: [
                { name: t("sidebar.blog"), path: "/dashboard/blogs" },
                { name: t("sidebar.blogDetails"), path: "/dashboard/blogs/details" },
                { name: t("sidebar.createBlog"), path: "/dashboard/blogs/create" },
              ],
            },
            { name: t("sidebar.chat") },
            { name: t("sidebar.contacts"), path: "/dashboard/contacts" },
            { name: t("sidebar.contactUs") },
            {
              name: t("sidebar.ecommerce"),
              children: [
                { name: t("sidebar.shop") },
                { name: t("sidebar.productDetails") },
                { name: t("sidebar.cart") },
              ],
            },
            {
              name: t("sidebar.email"),
              children: [
                { name: t("sidebar.inbox") },
                { name: t("sidebar.readMail") },
              ],
            },
            { name: t("sidebar.empty") },
            { name: t("sidebar.faqs"), path: "/dashboard/faqs" },
            { name: "Showrooms", path: "/dashboard/showrooms" },
            { name: "Product Info", path: "/dashboard/product-info" },
            { name: "Banners", path: "/dashboard/banners" },
            { name: "Videos", path: "/dashboard/videos" },
            { name: "Reviews", path: "/dashboard/reviews" },
            {
              name: t("sidebar.fileManager"),
              children: [
                { name: t("sidebar.files"), path: "/dashboard/files" },
                { name: t("sidebar.recentFiles"), path: "/dashboard/files/recent" },
              ],
            },
            {
              name: t("sidebar.invoice"),
              children: [
                { name: t("sidebar.invoiceList") },
                { name: t("sidebar.invoiceDetails") },
              ],
            },
            { name: t("sidebar.landing") },
            { name: t("sidebar.jobsLanding") },
          ],
        },
        {
          title: t("sidebar.task"),
          icon: <FiCheckSquare />,
          badge: t("sidebar.new"),
          children: [
            { name: t("sidebar.taskList") },
            { name: t("sidebar.taskDetails") },
            { name: t("sidebar.createTask") },
          ],
        },
        {
          title: t("sidebar.authentication"),
          icon: <FiShield />,
          children: [
            { name: t("sidebar.login"), path: "/" },
            { name: t("sidebar.register"), path: "/signup" },
            { name: t("sidebar.forgotPassword") },
          ],
        },
        {
          title: t("sidebar.error"),
          icon: <FiAlertTriangle />,
          children: [
            { name: t("sidebar.page404") },
            { name: t("sidebar.page500") },
          ],
        },
      ],
    },
    {
      section: t("sidebar.general"),
      menus: [
        {
          title: t("sidebar.uiElements"),
          icon: <FiBox />,
          children: [
            { name: t("sidebar.buttons") },
            { name: t("sidebar.cards") },
            { name: t("sidebar.modal") },
          ],
        },
        {
          title: t("sidebar.utilities"),
          icon: <FiActivity />,
          children: [
            { name: t("sidebar.colors") },
            { name: t("sidebar.borders") },
            { name: t("sidebar.typography") },
          ],
        },
        {
          title: t("sidebar.forms"),
          icon: <FiFileText />,
          children: [
            { name: t("sidebar.formElements") },
            { name: t("sidebar.formValidation") },
          ],
        },
        {
          title: t("sidebar.advancedUI"),
          icon: <FiLayers />,
          children: [
            { name: t("sidebar.dragDrop") },
            { name: t("sidebar.rangeSlider") },
          ],
        },
        {
          title: t("sidebar.widgets"),
          icon: <FiPieChart />,
          badge: t("sidebar.hot"),
          children: [
            { name: t("sidebar.statistics") },
            { name: t("sidebar.chartsWidget") },
          ],
        },
      ],
    },
    {
      section: t("sidebar.webApps"),
      menus: [
        {
          title: t("sidebar.apps"),
          icon: <FiGrid />,
          badge: t("sidebar.new"),
          children: [
            { name: t("sidebar.kanban") },
            { name: t("sidebar.calendar") },
            { name: t("sidebar.chatApp") },
          ],
        },
        {
          title: t("sidebar.nestedMenu"),
          icon: <FiLayers />,
          children: [
            {
              name: t("sidebar.level1"),
              children: [
                { name: t("sidebar.level2") },
                { name: t("sidebar.level21") },
              ],
            },
          ],
        },
      ],
    },
    {
      section: t("sidebar.tablesCharts"),
      menus: [
        {
          title: t("sidebar.tables"),
          icon: <FiGrid />,
          badge: "3",
          children: [
            { name: t("sidebar.basicTables") },
            { name: t("sidebar.dataTables") },
          ],
        },
        {
          title: t("sidebar.charts"),
          icon: <FiBarChart2 />,
          children: [
            { name: t("sidebar.apexCharts") },
            { name: t("sidebar.chartJs") },
          ],
        },
      ],
    },
    {
      section: t("sidebar.mapsIcons"),
      menus: [
        {
          title: t("sidebar.maps"),
          icon: <FiMapPin />,
          children: [
            { name: t("sidebar.googleMaps") },
            { name: t("sidebar.vectorMaps") },
          ],
        },
        {
          title: t("sidebar.icons"),
          icon: <FiStar />,
          children: [
            { name: t("sidebar.fontAwesome") },
            { name: t("sidebar.bootstrapIcons") },
          ],
        },
      ],
    },
  ];

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        {!collapsed && <h2>Y<span>nex</span></h2>}
      </div>

      <div className="sidebar-content">
        {menuData.map((section, idx) => (
          <div key={idx}>
            {!collapsed && <p className="section-title">{section.section}</p>}
            {section.menus.map((menu, i) => (
              <div key={i}>
                <div
                  className={`menu-item ${openMenu === menu.title ? "active-parent" : ""}`}
                  onClick={() => setOpenMenu(openMenu === menu.title ? "" : menu.title)}
                >
                  <div className="menu-left">
                    <span className="menu-icon">{menu.icon}</span>
                    {!collapsed && <span className="menu-text">{menu.title}</span>}
                    {!collapsed && menu.badge && (
                      <span className={menu.badge === t("sidebar.new") || menu.badge === t("sidebar.hot") ? "badge-new" : "badge-count"}>
                        {menu.badge}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <span className="arrow">
                      {openMenu === menu.title ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  )}
                </div>

                {openMenu === menu.title && menu.children && (
                  <ul className="submenu">
                    {menu.children.map((sub, index) => (
                      <li key={index}>
                        {!sub.children ? (
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) => isActive ? "submenu-item active-submenu" : "submenu-item"}
                          >
                            <span className="dot"></span>
                            {sub.icon && <span className="menu-icon">{sub.icon}</span>}
                            {!collapsed && <span>{sub.name}</span>}
                          </NavLink>
                        ) : (
                          <>
                            <div className="submenu-item" onClick={() => toggleSubMenu(sub.name)}>
                              <div className="submenu-left">
                                <span className="dot"></span>
                                {sub.icon && <span className="menu-icon">{sub.icon}</span>}
                                {!collapsed && <span>{sub.name}</span>}
                              </div>
                              {openSubMenus[sub.name] ? (
                                <FiChevronDown className="mini-arrow" />
                              ) : (
                                <FiChevronRight className="mini-arrow" />
                              )}
                            </div>
                            {openSubMenus[sub.name] && (
                              <ul className="nested-submenu">
                                {sub.children.map((nested, i) => (
                                  <li key={i}>
                                    {nested.path ? (
                                      <NavLink
                                        to={nested.path}
                                        className={({ isActive }) => isActive ? "nested-item nested-active" : "nested-item"}
                                      >
                                        <span className="dot"></span>
                                        {!collapsed && <span>{nested.name}</span>}
                                      </NavLink>
                                    ) : (
                                      <div
                                        className={active === nested.name ? "nested-item nested-active" : "nested-item"}
                                        onClick={() => setActive(nested.name)}
                                      >
                                        <span className="dot"></span>
                                        {!collapsed && <span>{nested.name}</span>}
                                      </div>
                                    )}
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
