import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Layout.css";

const Layout = () => {
  return (
    <div className="layout">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="page-content">
          <Outlet />
        </div>

        <Footer />

      </div>

    </div>
  );
};

export default Layout;