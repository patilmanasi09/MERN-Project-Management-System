import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FaUserCircle, FaEdit, FaUsers } from "react-icons/fa";

const roleClass = (role) => {
  const key = (role || "").toLowerCase();
  if (key === "admin") return "status-admin";
  if (key === "hod") return "status-hod";
  return "status-user";
};

const Users = () => {

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    contactNumber: "",
    role: "",
    image: null,
  });

  const getUsers = async () => {
    try {
      const res = await axiosInstance.get("/user/getAllUsers");
      setUsers(res.data.users || []);
    } catch (error) {
      console.log("GET USERS ERROR:", error);
    }
  };

  const updateUser = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editUser.name);
      formData.append("email", editUser.email);
      formData.append("contactNumber", editUser.contactNumber);
      formData.append("role", editUser.role);

      if (editUser.image) {
        formData.append("imgPath", editUser.image);
      }

      await axiosInstance.put(`/user/updateUser/${editUser.id}`, formData);

      toast.success("User updated successfully");

      setShowModal(false);
      getUsers();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Update failed");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container py-0">

      <span className="page-eyebrow">Team</span>
      <h2 className="page-title mb-4">All Users</h2>

      <div className="table-card">

        <div className="section-card-header">
          <h3><FaUsers /> {users.length} {users.length === 1 ? "user" : "users"}</h3>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <h5>No users found</h5>
            <p>Registered users will show up here.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>

                  <td>
                    {user.imgPath ? (
                      <img
                        src={`http://localhost:5004${user.imgPath}?t=${Date.now()}`}
                        alt="Profile"
                        width="38"
                        height="38"
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <FaUserCircle size={32} color="var(--muted)" />
                    )}
                  </td>

                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contactNumber}</td>

                  <td>
                    <span className={`status ${roleClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${user.status === "active" ? "status-completed" : "status-admin"}`}>
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditUser({
                          id: user._id,
                          name: user.name,
                          email: user.email,
                          contactNumber: user.contactNumber,
                          role: user.role,
                          image: null,
                        });

                        setShowModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-bg">
          <div className="edit-modal">
            <h3>Update user</h3>

            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control mb-3"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />

            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control mb-3"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />

            <label className="form-label">Contact number</label>
            <input
              type="text"
              className="form-control mb-3"
              value={editUser.contactNumber}
              onChange={(e) => setEditUser({ ...editUser, contactNumber: e.target.value })}
            />

            <label className="form-label">Role</label>
            <select
              className="form-select mb-3"
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="HOD">HOD</option>
              <option value="admin">Admin</option>
            </select>

            <label className="form-label">Profile image</label>
            <input
              type="file"
              className="form-control mb-3"
              accept="image/*"
              onChange={(e) => setEditUser({ ...editUser, image: e.target.files[0] })}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-brand" onClick={updateUser}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
