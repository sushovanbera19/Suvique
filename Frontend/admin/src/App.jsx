import {BrowserRouter,Routes,Route,Navigate,} from "react-router-dom";
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
import Inventory from "./components/dashboard/Inventory";
import Vendors from "./components/dashboard/Vendors";
import Support from "./components/dashboard/Support";
import Settings from "./components/dashboard/Settings";
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
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" />
              : (
                <AdminLogin
                  setIsLoggedIn={setIsLoggedIn}
                />
              )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn
              ? (
                <Dashboard
                  setIsLoggedIn={setIsLoggedIn}
                />
              )
              : <Navigate to="/" />
          }
        >

          <Route
            path="overview" element={<Overview />}
          />

          <Route
            path="sales"
            element={<Sales />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="products"
            element={<Products />}
          />
          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="marketing"
            element={<Marketing />}
          />

          <Route
            path="finance"
            element={<Finance />}
          />

          <Route
            path="inventory"
            element={<Inventory />}
          />

          <Route
            path="vendors"
            element={<Vendors />}
          />

          <Route
            path="support"
            element={<Support />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;