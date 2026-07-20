import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/authSlice";
import { toast } from "react-toastify";
import { FaProjectDiagram } from "react-icons/fa";
import "../styles/Login.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    role: "user",
    imgPath: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "imgPath") {
      setFormData({
        ...formData,
        imgPath: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("contactNumber", formData.contactNumber);
    data.append("role", formData.role);
    data.append("imgPath", formData.imgPath);

    const result = await dispatch(registerUser(data));

    if (registerUser.fulfilled.match(result)) {
      toast.success(result.payload.msg || "Registration successful");
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
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
          <span className="eyebrow">Get started</span>
          <h1>Set up your account in a minute.</h1>
          <p>
            Join your department's workspace to create projects, pick up
            tasks, and follow progress as it happens.
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
          <h2>Create account</h2>
          <p>Register for the Project Management System</p>

          <form onSubmit={handleSubmit}>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Enter Name"
              onChange={handleChange}
              required
            />

            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
            />

            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />

            <input
              className="form-control"
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              onChange={handleChange}
              required
            />

            <select
              className="form-select"
              name="role"
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="HOD">HOD</option>
              <option value="admin">Admin</option>
            </select>

            <label className="form-label" style={{ marginTop: 4 }}>
              Profile photo
            </label>
            <input
              className="form-control"
              type="file"
              name="imgPath"
              onChange={handleChange}
              required
            />

            <button className="primary-btn mt-3" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account?
            <span onClick={() => navigate("/")}>Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
