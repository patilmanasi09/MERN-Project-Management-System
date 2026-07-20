import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  FaHome,
  FaProjectDiagram,
  FaPlusCircle,
  FaUsers,
  FaBuilding,
  FaUser,
  FaTasks,
} from "react-icons/fa";

import "../styles/Sidebar.css";

// Every item lists which roles can see it.
// admin: full access · HOD: manage projects for their department · user: view only
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FaHome, roles: ["admin", "HOD", "user"] },
  { to: "/projects", label: "Projects", icon: FaProjectDiagram, roles: ["admin", "HOD", "user"] },
  { to: "/my-tasks", label: "My Tasks", icon: FaTasks, roles: ["admin", "HOD", "user"] },
  { to: "/create-project", label: "Create Project", icon: FaPlusCircle, roles: ["admin", "HOD"] },
  { to: "/users", label: "Users", icon: FaUsers, roles: ["admin"] },
  { to: "/departments", label: "Departments", icon: FaBuilding, roles: ["admin"] },
  { to: "/profile", label: "Profile", icon: FaUser, roles: ["admin", "HOD", "user"] },
];

const Sidebar = () => {

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <FaProjectDiagram size={35} />
        <h3>PMS</h3>
      </div>

      {user && (
        <div className="sidebar-role-tag">
          Signed in as <strong>{role}</strong>
        </div>
      )}

      {/* Menu */}
      <ul className="nav flex-column">

        {visibleItems.map(({ to, label, icon: Icon }) => (
          <li className="nav-item" key={to}>
            <NavLink to={to} className="nav-link">
              <Icon className="me-2" />
              {label}
            </NavLink>
          </li>
        ))}

      </ul>

    </aside>
  );
};

export default Sidebar;
