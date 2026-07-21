import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Topnav from './components/topnav'
import Header from './components/Header/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Login from './Auth/Login'
import NewsletterSubscribe from "./Common/NewsletterSubscribe";
import FurnitureGallery from "./Common/FurnitureGallery";
import SignUpPage from "./Auth/SignupPage"
import ContactUs from "../src/components/ContactUs"
import CardItem from "./Common/Cardpage"
import AboutUs from "./components/AboutUs";
import Wishlist from "./components/wishlist"
import FAQSection from "./components/FAQSection"
import ComparePage from "./components/ComparePage";
import ShowroomPage from "./components/ShowroomPage"
import Checkout from "./components/Checkout"
import PaymentResult from "./pages/PaymentResult"
import ThankYou from "./pages/ThankYou"
import Blog1 from "./components/blog1";
import Blog2 from "./components/Blog2";
import BlogDetails from "./components/BlogDetails";
import ShopPage1 from "./components/ShopPage1";
import ShopPage2 from "./components/ShopPage2";
import ShopPage3 from "./components/Shoppage3"
import NotFound from "./Common/404-1";
import ProductPage from "./components/ProductPage1";
import InteriorDesigner from "./pages/InteriorDesigner";
import FurnitureAnalytics from "./pages/FurnitureAnalytics";
import BoutiqueStore from "./pages/BoutiqueStore";
import Careers from "./pages/Careers";
import Customers from "./pages/Customers";
import SmartFinance from "./pages/SmartFinance";
import DesignGuides from "./pages/DesignGuides";
import UserProfile from "./pages/UserProfile";
import UserOrders from "./pages/UserOrders";
import TrackOrder from "./pages/TrackOrder";
import SearchPage from "./pages/SearchPage";
import { CompareProvider } from "./context/CompareContext";
import { CountryProvider } from "./context/CountryContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <CountryProvider>
    <LanguageProvider>
    <CompareProvider>
    <BrowserRouter>
      {/* Topnav + Header always visible */}
      <div className="sticky-wrapper">
        <Topnav />
        <Header />
      </div>

      {/* Middle content changes depending on route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<CardItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/product-details-1/:id" element={<ProductPage />} />
        <Route path="/product-details-3/:id" element={<ProductPage />} />
        <Route path="/product-details-4/:id" element={<ProductPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/location" element={<ShowroomPage />} />
        <Route path="/blog-1" element={<Blog1 />} />
        <Route path="/blog-2" element={<Blog2 />} />
        <Route path="/blog-3" element={<Blog2 />} />
        <Route path="/blog-single" element={<BlogDetails />} />
        <Route path="/Shop-1" element={<ShopPage1 />} />
        <Route path="/Shop-2" element={<ShopPage2 />} />
        <Route path="/Shop-3" element={<ShopPage3 />} />
        <Route path="/interior-designer" element={<InteriorDesigner />} />
        <Route path="/analytics" element={<FurnitureAnalytics />} />
        <Route path="/boutique-store" element={<BoutiqueStore />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/smart-finance" element={<SmartFinance />} />
        <Route path="/guides" element={<DesignGuides />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/payment/success" element={<PaymentResult />} />
        <Route path="/payment/fail" element={<PaymentResult />} />
        <Route path="/thank-you" element={<ThankYou />} />
        {/* NotFound version 1 */}
        <Route
          path="/404-1"
          element={<NotFound backgroundImage="/images/404-1.jpg" />}
        />

        {/* NotFound version 2 */}
        <Route
          path="/404-2"
          element={<NotFound backgroundImage="/images/404-2.jpg" />}
        />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={<NotFound backgroundImage="/images/404-1.jpg" />}
        />
      </Routes>

      {/* Footer always visible */}
      <NewsletterSubscribe />
      <FurnitureGallery />
      <Footer />
    </BrowserRouter>
    </CompareProvider>
    </LanguageProvider>
    </CountryProvider>
  );
}

export default App;