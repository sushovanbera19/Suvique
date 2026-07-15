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
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : (<AdminLogin setIsLoggedIn={setIsLoggedIn} />)} />
        <Route
          path="/signup"
          element={<Signup />}
        />
        {/* Dashboard */}
        <Route path="/dashboard" element={isLoggedIn ? (<Dashboard setIsLoggedIn={setIsLoggedIn} />) : <Navigate to="/" />}>
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