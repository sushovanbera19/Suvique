import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import Overview from "./components/Dashboard/Overview";
import Sales from "./components/Dashboard/Sales";
import Orders from "./components/dashboard/Orders";
import Products from "./components/dashboard/Products";
import Customers from "./components/dashboard/Customers";
import Analytics from "./components/dashboard/Analytics";
import Marketing from "./components/dashboard/Marketing";
import Finance from "./components/dashboard/Finance";
import Inventory from "./components/dashboard/variation";
import Vendors from "./components/dashboard/Vendors";
import Support from "./components/dashboard/Support";
import Settings from "./components/dashboard/Settings";
import CategoryList from "./components/category/CategoryList";
import AddCategory from "./components/category/AddCategory";
import SubCategoryList from "./components/subcategory/SubCategoryList";
import AddSubCategory from "./components/subcategory/AddSubCategory";
import EditSubCategory from "./components/subcategory/EditSubCategory";
import Signup from "./pages/AdminSignup";
import EditCategory from "./components/category/EditCategory";
import AboutUs from "./components/Dashboard/AboutUs";
import AdminBlog from "./components/Dashboard/BlogAdmin";
import BlogDetailsAdmin from "./components/Dashboard/BlogDetailsAdmin";
import BlogCreate from "./components/Dashboard/BlogCreate";
import BlogEdit from "./components/Dashboard/BlogEdit";
import StaticPagesAdmin from "./components/Dashboard/StaticPagesAdmin";
import FileManager from "./components/Dashboard/FileManager";
import ContactAdmin from "./components/Dashboard/ContactAdmin";
import FAQAdmin from "./components/Dashboard/FAQAdmin";
import ShowroomAdmin from "./components/Dashboard/ShowroomAdmin";
import ProductInfoAdmin from "./components/Dashboard/ProductInfoAdmin";
import BannerAdmin from "./components/Dashboard/BannerAdmin";
import VideoAdmin from "./components/Dashboard/VideoAdmin";
import ReviewAdmin from "./components/Dashboard/ReviewAdmin";
import BasicTables from "./components/Dashboard/BasicTables";
import DataTables from "./components/Dashboard/DataTables";
import { SettingsProvider } from "./context/SettingsContext";
import "./App.css";

const App = () => {

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {

    const auth =
      localStorage.getItem("adminAuth");

    setIsLoggedIn(auth === "true");

  }, []);

  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>

        {/* Login */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard/overview" /> : (<AdminLogin setIsLoggedIn={setIsLoggedIn} />)} />
        <Route
          path="/signup"
          element={<Signup />}
        />
        {/* Dashboard */}
        <Route path="/dashboard" element={isLoggedIn ? (<Dashboard setIsLoggedIn={setIsLoggedIn} />) : <Navigate to="/" />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="sales" element={<Sales />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="finance" element={<Finance />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="blogs" element={<AdminBlog />} />
          <Route path="blogs/details" element={<BlogDetailsAdmin />} />
          <Route path="blogs/details/:id" element={<BlogDetailsAdmin />} />
          <Route path="blogs/create" element={<BlogCreate />} />
          <Route path="blogs/edit/:id" element={<BlogEdit />} />
          <Route path="static-pages" element={<StaticPagesAdmin />} />
          <Route path="contacts" element={<ContactAdmin />} />
          <Route path="faqs" element={<FAQAdmin />} />
          <Route path="showrooms" element={<ShowroomAdmin />} />
          <Route path="product-info" element={<ProductInfoAdmin />} />
          <Route path="banners" element={<BannerAdmin />} />
          <Route path="videos" element={<VideoAdmin />} />
          <Route path="reviews" element={<ReviewAdmin />} />
          <Route path="files" element={<FileManager />} />
          <Route path="files/recent" element={<FileManager recentOnly />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="data-tables" element={<DataTables />} />
          {/* Category */}
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/create" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          {/* Sub Category */}
          <Route path="sub-categories" element={<SubCategoryList />} />
          <Route path="sub-categories/create" element={<AddSubCategory />} />
          <Route
            path="sub-categories/edit/:id"
            element={<EditSubCategory />}
          />

        </Route>
      </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
};

export default App;