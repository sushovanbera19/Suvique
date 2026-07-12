import chair2 from "../../../public/images/img-1.webp";
import UserIcon from "../../../public/images/266134.png";
import CartIcon from "../../../public/images/cart_icon.png";

export const menuItems = [
  {
    name: "Home",
    path: "/",
  },

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
          {
            label: "Product Details 1",
            layout: "1",
          },
          {
            label: "Product Details 3",
            layout: "3",
          },
          {
            label: "Product Details 4",
            layout: "4",
          }
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
        title: "Special Offer",
        offer: "🔥 Urna's Special Offer: Sale up to 30% Only Today!",
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

export const cartItems = [
  {
    id: 2,
    name: "Modular Sofa with Wood",
    price: "399.00",
    qty: 2,
    image:
      "https://furnisy.vercel.app/_next/image?url=%2Fimages%2Fhome-1%2Ffeatured-products%2Fimg-3.webp&w=1920&q=75",
  },
];