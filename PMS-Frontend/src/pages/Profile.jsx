import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaCamera,
  FaLock,
  FaSave
} from "react-icons/fa";

import {
  updateProfile,
  changePassword,
  clearProfileStatus,
  clearPasswordStatus
} from "../redux/authSlice";

const roleClass = (role) => {
  const key = (role || "").toLowerCase();
  if (key === "admin") return "status-admin";
  if (key === "hod") return "status-hod";
  return "status-user";
};

const Profile = () => {

  const dispatch = useDispatch();
  const { user, profileLoading, profileStatus, profileError, passwordLoading, passwordStatus, passwordError } =
    useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (profileStatus === "success") {
      toast.success("Profile updated successfully");
      dispatch(clearProfileStatus());
    }
    if (profileStatus === "failed") {
      toast.error(profileError || "Failed to update profile");
      dispatch(clearProfileStatus());
    }
  }, [profileStatus, profileError, dispatch]);

  useEffect(() => {
    if (passwordStatus === "success") {
      toast.success("Password changed successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      dispatch(clearPasswordStatus());
    }
    if (passwordStatus === "failed") {
      toast.error(passwordError || "Failed to change password");
      dispatch(clearPasswordStatus());
    }
  }, [passwordStatus, passwordError, dispatch]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("contactNumber", form.contactNumber);

    if (imageFile) {
      data.append("imgPath", imageFile);
    }

    dispatch(updateProfile(data));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    dispatch(changePassword({
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword,
    }));
  };

  return (
    <div className="profile-page">

      <span className="page-eyebrow">Account</span>
      <h2 className="page-title mb-4">My Profile</h2>

      <div className="row g-4">

        {/* Profile details */}
        <div className="col-lg-7">
          <div className="form-card">
            <div className="form-card-header">
              <span className="page-eyebrow">Personal info</span>
              <h3>Profile details</h3>
            </div>

            <div className="form-card-body">

              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{ position: "relative" }}>
                  {(preview || user?.imgPath) ? (
                    <img
                      src={preview || user.imgPath}
                      alt="Profile"
                      width="72"
                      height="72"
                      style={{ borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }}
                    />
                  ) : (
                    <FaUserCircle size={72} color="var(--muted)" />
                  )}

                  <label
                    htmlFor="profile-image-input"
                    className="icon-btn"
                    style={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      background: "var(--surface)",
                      margin: 0,
                      cursor: "pointer"
                    }}
                  >
                    <FaCamera size={13} />
                  </label>

                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>

                <div>
                  <h5 className="mb-1">{user?.name}</h5>
                  <span className={`status ${roleClass(user?.role)}`}>{user?.role}</span>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Contact number</label>
                  <input
                    className="form-control"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <button className="btn-brand" type="submit" disabled={profileLoading}>
                  <FaSave size={13} />
                  {profileLoading ? "Saving..." : "Save changes"}
                </button>
              </form>

            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="col-lg-5">
          <div className="form-card">
            <div className="form-card-header">
              <span className="page-eyebrow">Security</span>
              <h3>Change password</h3>
            </div>

            <div className="form-card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    minLength={6}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm new password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    minLength={6}
                    required
                  />
                </div>

                <button className="btn-ghost" type="submit" disabled={passwordLoading}>
                  <FaLock size={13} />
                  {passwordLoading ? "Updating..." : "Update password"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
