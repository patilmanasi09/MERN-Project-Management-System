import React from "react";
import { FaProjectDiagram } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer-brand">
        <FaProjectDiagram size={14} />
        Project Management System
      </div>

      <div className="app-footer-meta">
        &copy; {year} PMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
