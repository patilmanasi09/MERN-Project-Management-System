import React from "react";
import {
  FaProjectDiagram,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

import "../styles/Navbar.css";

const Navbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (

    <header className="navbar-custom">

      <div className="logo-title">

        <FaProjectDiagram size={22} />

        <h4>Project Management System</h4>

      </div>

      <div className="right-section">

        <div className="admin-box" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>

          {user?.imgPath ? (
            <img
              src={user.imgPath}
              alt="Profile"
              width="34"
              height="34"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <FaUserCircle size={30} />
          )}

          <div>

            <strong>{user?.name || "..."}</strong>

            <small>{user?.role || "Loading"}</small>

          </div>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </header>
  );
};

export default Navbar;
