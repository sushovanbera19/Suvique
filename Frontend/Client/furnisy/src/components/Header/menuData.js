import chair2 from "../../../public/images/img-1.webp";
import UserIcon from "../../../public/images/266134.png";
import CartIcon from "../../../public/images/cart_icon.png";

export const getMenuItems = (t) => [
  {
    name: t("nav.home"),
    path: "/",
  },

  {
    name: t("nav.shop"),
    subMenu: [
      { label: t("nav.shop1"), path: "/Shop-1" },
      { label: t("nav.shop2"), path: "/Shop-2" },
      { label: t("nav.shop3"), path: "/Shop-3" },
    ],
  },

  {
    name: t("nav.blog"),
    subMenu: [
      { label: t("nav.blog1"), path: "/blog-1" },
      { label: t("nav.blog2"), path: "/blog-2" },
      { label: t("nav.blog3"), path: "/blog-3" },
      { label: t("nav.blogSingle"), path: "/blog-single" },
    ],
  },

  {
    name: t("nav.pages"),
    megaMenu: [
      {
        title: t("nav.productLayout"),
        links: [
          { label: t("nav.productDetails1"), layout: "1" },
          { label: t("nav.productDetails3"), layout: "3" },
          { label: t("nav.productDetails4"), layout: "4" },
        ],
      },

      {
        title: t("nav.pages"),
        links: [
          { label: t("nav.aboutUs"), path: "/about" },
          { label: t("nav.contactUs"), path: "/contact" },
          { label: t("nav.viewCart"), path: "/cart" },
          { label: t("nav.checkout"), path: "/checkout" },
          { label: t("nav.wishlist"), path: "/wishlist" },
          { label: t("nav.compare"), path: "/compare" },
        ],
      },

      {
        title: t("nav.usefulLinks"),
        links: [
          { label: t("nav.register"), path: "/register" },
          { label: t("nav.login"), path: "/login" },
          { label: t("nav.location"), path: "/location" },
          { label: t("nav.faq"), path: "/faq" },
          { label: "404-1", path: "/404-1" },
          { label: "404-2", path: "/404-2" },
        ],
      },

      {
        title: t("nav.featuredProducts"),
        products: [
          {
            img: chair2,
            name: "Modern Dark Wood Chair",
            price: "$299.00 USD",
          },
          {
            img: chair2,
            name: "Modular Sofa with Wood",
            price: "$399.00 USD",
          },
          {
            img: chair2,
            name: "Modern Tolik Chair",
            price: "$199.00 USD",
          },
        ],
      },

      {
        title: t("nav.specialOffer"),
        offer: t("nav.specialOfferText"),
      },
    ],
  },
];

export const rightMenuItems = [
  {
    name: "",
    img: UserIcon,
    path: "/login",
  },

  {
    name: "",
    img: CartIcon,
    path: "/cart",
  },
];
