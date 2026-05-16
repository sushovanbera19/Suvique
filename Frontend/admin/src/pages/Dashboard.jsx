import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import "../../src/assets/style/Dashboard.css";
import "../assets/style/Breadcrumb.css"

const Dashboard = () => {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} />

      {/* MAIN SECTION */}
      <div
        className={
          collapsed
            ? "main-section collapsed-main"
            : "main-section"
        }
      >
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;