import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faDollarSign, faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../assets/style/Header.css";
import chair2 from "../../public/images/img-1.webp";
import Flag from "../../public/images/united-states.png";
import UserIcon from "../../public/images/266134.png";
import CartIcon from "../../public/images/cart_icon.png";

// ================= MENU ITEMS =================

const menuItems = [
  { name: "Home", path: "/" },

  {
    name: "Shop",


    subMenu: [
      { label: "Shop 1", path: "/Shop-1" },
      { label: "Shop 2", path: "/Shop-2" },
      { label: "Shop 3", path: "/Shop-3" },
    ],
  },
  {
    name: "Blog",


    subMenu: [
      { label: "Blog-1", path: "/blog-1" },
      { label: "Blog-2", path: "/blog-2" },
      { label: "Blog-3", path: "/blog-3" },
      { label: "Blog-Single", path: "/blog-single" },

    ],
  },


  {
    name: "Pages",
    megaMenu: [
      {
        title: "Product Layout",

        links: [

          { label: "Product Details 1", path: "/product-details-1" },
          { label: "Product Details 3", path: "/product-details-3" },
          { label: "Product Details 4", path: "/product-details-4" },
        ],
      },

      {
        title: "Pages",
        links: [
          { label: "About Us", path: "/about" },
          { label: "Contact Us", path: "/contact" },
          { label: "View Cart", path: "/cart" },
          { label: "Checkout", path: "/checkout" },
          { label: "Wishlist", path: "/wishlist" },
          { label: "Compare", path: "/compare" },
        ],
      },

      {
        title: "Useful Links",
        links: [
          { label: "Register", path: "/register" },
          { label: "Login", path: "/login" },
          { label: "Location", path: "/location" },
          { label: "FAQ", path: "/faq" },
          { label: "404-1", path: "/404-1" },
          { label: "404-2", path: "/404-2" },
        ],
      },

      {
        title: "Featured Products",
        products: [
          { img: chair2, name: "Modern Dark Wood Chair", price: "$299.00 USD" },
          { img: chair2, name: "Modular Sofa with Wood", price: "$399.00 USD" },
          { img: chair2, name: "Modern Tolik Chair", price: "$199.00 USD" },
        ],
      },

      {
        title: "Special Offer",
        offer: "🔥 Urna's Special Offer: Sale up to 30% Only Today!",
      },

    ],
  },
];

const rightMenuItems = [
  {
    name: "",
    img: UserIcon,
    path: "/login"
  },

  {
    name: "",
    img: CartIcon,
    path: "/cart"
  },
];


const cartItems = [
  { id: 2, name: "Modular Sofa with Wood", price: "399.00", qty: 2, image: "https://furnisy.vercel.app/_next/image?url=%2Fimages%2Fhome-1%2Ffeatured-products%2Fimg-3.webp&w=1920&q=75" },
  { id: 3, name: "Modern Tolik Chair", price: "199.00", qty: 1, image: "https://furnisy.vercel.app/_next/image?url=%2Fimages%2Fhome-1%2Ffeatured-products%2Fimg-3.webp&w=1920&q=75" },
];

// ================= SUB COMPONENTS =================

const Dropdown = ({ items }) => (
  <ul className="dropdown">
    {items.map((sub, idx) => (
      <li key={idx}>
        {sub.path ? <Link to={sub.path}>{sub.label}</Link> : sub}
      </li>
    ))}
  </ul>
);

const MegaMenu = ({ megaMenu }) => (
  <div className="mega-dropdown">
    {megaMenu.map((col, idx) => (
      <div key={idx} className="mega-column">
        {col.title && <h4>{col.title}</h4>}
        {col.links && (
          <ul className="mega-links">
            {col.links.map((link, lIdx) => (
              <li key={lIdx}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
        {col.products && (
          <ul className="mega-products">
            {col.products.map((p, pIdx) => (
              <li key={pIdx} className="mega-product-item">
                <img src={p.img} alt={p.name} />
                <div className="product-info">
                  <p className="product-name">{p.name}</p>
                  <span className="product-price">{p.price}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {col.offer && <div className="mega-offer">{col.offer}</div>}
      </div>
    ))}
  </div>
);

const LeftMenu = ({ menuItems }) => {
  const [openMenu, setOpenMenu] = useState(null);
  return (
    <nav className="left-menu">
      <ul>
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className={item.subMenu || item.megaMenu ? "has-dropdown" : ""}
            onMouseEnter={() => setOpenMenu(item.name)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            {item.path ? <Link to={item.path}>{item.name}</Link> : item.name}
            {(item.subMenu || item.megaMenu) && <FontAwesomeIcon icon={faAngleDown} className="arrow" />}
            {item.subMenu && openMenu === item.name && <Dropdown items={item.subMenu} />}
            {item.megaMenu && openMenu === item.name && <MegaMenu megaMenu={item.megaMenu} />}
          </li>
        ))}
      </ul>
    </nav>
  );
};



const RightMenu = ({ rightMenuItems, openSearchModal }) => {
  const [openRightMenu, setOpenRightMenu] = useState(null); // Tracks dropdowns
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false); // Tracks cart sidebar

  return (
    <>
      <nav className="right-menu">
        <ul>
          <li className="search-item">
            <FontAwesomeIcon
              icon={faSearch}
              className="search-icon"
              onClick={openSearchModal}
            />
          </li>

          {rightMenuItems.map((item, idx) => (
            <li
              key={idx}
              className={item.subMenu ? "has-dropdown" : ""}
              onMouseEnter={() => item.subMenu && setOpenRightMenu(item.name)}
              onMouseLeave={() => setOpenRightMenu(null)}
            >
              {item.flag && <img src={item.flag} className="currency-flag" alt="flag" />}

              {item.img && item.path ? (
                item.path === "/cart" ? (
                  // Cart icon click opens cart sidebar
                  <img
                    src={item.img}
                    className="right-icon-image cart-icon" // new class 'cart-icon' to differentiate from left sidebar
                    alt="cart"
                    onClick={() => setCartSidebarOpen(true)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Link to={item.path}>
                    <img src={item.img} className="right-icon-image" alt="icon" />
                  </Link>
                )
              ) : item.name}

              {item.subMenu && <FontAwesomeIcon icon={faAngleDown} className="arrow" />}
              {item.subMenu && openRightMenu === item.name && <Dropdown items={item.subMenu} />}
            </li>
          ))}
        </ul>
      </nav>

      {/* Right-side cart sidebar */}
      {cartSidebarOpen && (
        <div className="cart-sidebar-overlay" onClick={() => setCartSidebarOpen(false)}>
          <div className="cart-sidebar-right" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <div className="cart_sidebar_heading">
                <h3>Shopping cart</h3>
              </div>

              <div
                className="cart_sidebar_close-btn"
                onClick={() => setCartSidebarOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>

            {/* Render cart items here */}
            {/* Cart items */}
            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-layout">

                    {/* Image */}
                    <div className="cart_sidebar_image">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                      />
                    </div>

                    {/* Name */}
                    <div className="name">
                      {item.name}
                    </div>

                    {/* Quantity + Price */}
                    <div className="qty-price">
                      <div className="qty-box">
                        <button className="qty-btn">-</button>
                        <span className="qty">{item.qty}</span>
                        <button className="qty-btn">+</button>
                      </div>
                      <span className="item-price">${item.price}</span>
                    </div>

                    {/* Remove Button */}
                    <div className="cart_sidebar_remove">
                      <button className="cart_sidebar_remove-btn">Remove</button>
                    </div>

                  </div>
                </li>
              ))}
            </ul>

            {/* Total and checkout button */}
            <div className="cart-footer">

              <div className="cart-subtotal">
                <span>Subtotal:</span>
                <span>
                  $
                  {cartItems.reduce(
                    (sum, item) =>
                      sum + parseFloat(item.price.replace("$", "")) * item.qty,
                    0
                  ).toFixed(2)}
                </span>
              </div>

              <p className="free-shipping-text">
                Add $436.00 to cart and get <b>Free shipping!</b>
              </p>

              <div className="shipping-progress">
                <div className="shipping-progress-bar"></div>
              </div>

              <Link to="/cart" className="cart_sidebar_viewcart">
                View Cart
              </Link>

              <Link to="/checkout" className="cart_sidebar_checkout-btn">
                Check Out
              </Link>

            </div>
          </div>
        </div>
      )}
    </>
  );
};


// ================= SEARCH MODAL =================

const SearchModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h3>Search Products</h3>
          <div className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="search-modal-row">
          <select className="search-input-modal category-dropdown">
            <option value="all">All Categories</option>
            <option value="bedroom">Bed Room</option>
            <option value="living">Living Room</option>
            <option value="office">Office</option>
            <option value="accessories">Accessories</option>
            <option value="kitchen">Kitchen Accessories</option>
          </select>
          <input type="text" placeholder="Search What are you looking for? ..." className="search-input-modal_searchbar" autoFocus />
        </div>
      </div>
    </div>
  );
};

// ================= MOBILE SIDEBAR =================



const MobileSidebar = ({ open, menuItems, rightMenuItems, onClose }) => {
  const [openSidebarMenu, setOpenSidebarMenu] = useState(null);

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${open ? "active" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`mobile-sidebar ${open ? "open" : ""}`}>
        {/* Close button */}
        <div className="close-sidebar" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </div>

        <ul>
          {/* Left menu items */}
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <div
                className="mobile-menu-title"
                onClick={() =>
                  setOpenSidebarMenu(
                    openSidebarMenu === item.name ? null : item.name
                  )
                }
              >
                {item.path ? <Link to={item.path}>{item.name}</Link> : item.name}
                {(item.subMenu || item.megaMenu) && (
                  <FontAwesomeIcon icon={faAngleDown} />
                )}
              </div>

              {/* Submenu / mega menu */}
              {(item.subMenu || item.megaMenu) &&
                openSidebarMenu === item.name && (
                  <ul className="sidebar-submenu open">
                    {item.subMenu &&
                      item.subMenu.map((sub, sIdx) => (
                        <li key={sIdx}>
                          {sub.path ? <Link to={sub.path}>{sub.label}</Link> : sub}
                        </li>
                      ))}
                    {item.megaMenu &&
                      item.megaMenu.map((col, cIdx) => (
                        <li key={cIdx}>
                          {col.title && <strong>{col.title}</strong>}
                          {col.links && (
                            <ul>
                              {col.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <Link to={link.path}>{link.label}</Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
            </li>
          ))}

          <hr />

          {/* Right menu dropdowns only (e.g., US/EN) */}
          {rightMenuItems
            .filter((item) => item.subMenu) // only dropdowns
            .map((item, idx) => (
              <li key={idx}>
                <div
                  className="mobile-menu-title"
                  onClick={() =>
                    setOpenSidebarMenu(
                      openSidebarMenu === item.name ? null : item.name
                    )
                  }
                >
                  {/* Show name only, hide images/icons on mobile */}
                  {item.name}
                  {item.subMenu && (
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className={`arrow ${openSidebarMenu === item.name ? "rotate" : ""
                        }`}
                    />
                  )}
                </div>
                {item.subMenu && openSidebarMenu === item.name && (
                  <ul className="sidebar-submenu open">
                    {item.subMenu.map((sub, sIdx) => (
                      <li key={sIdx}>{sub}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};



// ================= HEADER =================

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  // NEW STATES
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [languages, setLanguages] = useState([]);
 useEffect(() => {
  const fetchDropdownData = async () => {
    try {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,languages"
      );
      const data = await res.json();

      // COUNTRIES
      const countryData = data.map((c) => ({
        code: c.name?.common,
        flag: c.flags?.png,
      }));

      // LANGUAGES (flatten unique values)
      const langSet = new Set();

      data.forEach((c) => {
        if (c.languages) {
          Object.values(c.languages).forEach((l) => langSet.add(l));
        }
      });

      const languageData = [...langSet].map((l) => ({
        code: l,
        flag: Flag,
      }));

      setCurrencies(countryData);
      setLanguages(languageData);

      // DEFAULT SELECTED VALUES
      setSelectedCountry(countryData[0]);
      setSelectedLanguage(languageData[0]);

    } catch (err) {
      console.log(err);
    }
  };

  fetchDropdownData();
}, []);

  const dynamicRightMenuItems = [
    {
      name: currencies[0]?.code || "USD",
      subMenu: currencies.map((item) => item.code),
      flag: currencies[0]?.flag || Flag,
    },

    {
      name: languages[0]?.code || "EN",
      subMenu: languages.map((item) => item.code),
      flag: languages[0]?.flag || Flag,
    },

    ...rightMenuItems
  ];
  return (
    <header className="topHeader">
      <div className="hamburger" onClick={() => setSidebarOpen(true)}>
        <FontAwesomeIcon icon={faBars} size="lg" />
      </div>
      <LeftMenu menuItems={menuItems} />
      <div className="center-logo">
        <Link to="/">
          <img src="/images/logo.png" alt="Logo" />
        </Link>
      </div>
      <RightMenu rightMenuItems={dynamicRightMenuItems} openSearchModal={() => setSearchModalOpen(true)} />
      <SearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <MobileSidebar
        open={sidebarOpen}
        menuItems={menuItems}
        rightMenuItems={dynamicRightMenuItems}
        onClose={() => setSidebarOpen(false)}
      />
    </header>
  );
};

export default Header;