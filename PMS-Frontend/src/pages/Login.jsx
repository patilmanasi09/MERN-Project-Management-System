import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getUserInfo, clearError } from "../redux/authSlice";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaProjectDiagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(loginUser(loginData));

    if (loginUser.fulfilled.match(result)) {
      toast.success(result.payload.msg || "Login successful");
      await dispatch(getUserInfo());
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-mark">
          <span className="mark-icon">
            <FaProjectDiagram size={16} />
          </span>
          PMS
        </div>

        <div className="auth-brand-copy">
          <span className="eyebrow">Project Management System</span>
          <h1>Every project, every status, one place.</h1>
          <p>
            Track projects across departments, assign tasks to your team,
            and see what's on schedule and what needs attention.
          </p>
        </div>

        <div className="auth-brand-foot">
          <div>
            <strong>Projects</strong>
            tracked in real time
          </div>
          <div>
            <strong>Tasks</strong>
            assigned per user
          </div>
          <div>
            <strong>Roles</strong>
            HOD &amp; admin control
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <h2>Welcome back</h2>
          <p>Log in to manage your projects</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="register-text">
            Don't have an account?
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
