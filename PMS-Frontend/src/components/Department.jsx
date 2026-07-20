import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FaBuilding, FaPlus, FaTrash } from "react-icons/fa";

const Department = () => {

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [department, setDepartment] = useState({
    departmentName: "",
    departmentCode: "",
    description: "",
    status: "Active",
  });

  const getDepartments = async () => {
    try {
      const res = await axiosInstance.get("/department/getAll");
      setDepartments(res.data.departments || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const handleChange = (e) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

  const addDepartment = async () => {
    try {
      const res = await axiosInstance.post("/department/create", department);

      toast.success(res.data.msg || "Department added");

      setDepartment({
        departmentName: "",
        departmentCode: "",
        description: "",
        status: "Active",
      });

      setShowModal(false);
      getDepartments();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Failed to add department");
    }
  };

  const deleteDepartment = async (id) => {
    if (window.confirm("Delete this department?")) {
      try {
        await axiosInstance.delete(`/department/delete/${id}`);
        toast.success("Department deleted");
        getDepartments();
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.msg || "Failed to delete department");
      }
    }
  };

  return (
    <div className="container py-0">

      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <span className="page-eyebrow">Organization</span>
          <h2 className="page-title">Departments</h2>
        </div>

        <button className="btn-brand" onClick={() => setShowModal(true)}>
          <FaPlus size={13} /> Add department
        </button>
      </div>

      <div className="table-card">

        {loading ? (
          <div className="empty-state">Loading departments...</div>
        ) : departments.length === 0 ? (
          <div className="empty-state">
            <FaBuilding size={26} style={{ marginBottom: 10, color: "var(--muted)" }} />
            <h5>No departments found</h5>
            <p>Add a department to start assigning projects to it.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id}>
                  <td>{dept.departmentName}</td>
                  <td>{dept.departmentCode}</td>
                  <td>{dept.description}</td>
                  <td>
                    <span className={`status ${dept.status === "Active" ? "status-completed" : "status-admin"}`}>
                      {dept.status}
                    </span>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteDepartment(dept._id)}>
                      <FaTrash />
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
            <h3>Add department</h3>

            <label className="form-label">Department name</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="e.g. Cloud Engineering"
              name="departmentName"
              value={department.departmentName}
              onChange={handleChange}
            />

            <label className="form-label">Department code</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="e.g. CLD"
              name="departmentCode"
              value={department.departmentCode}
              onChange={handleChange}
            />

            <label className="form-label">Description</label>
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="What does this department own?"
              name="description"
              value={department.description}
              onChange={handleChange}
            />

            <label className="form-label">Status</label>
            <select
              className="form-select mb-3"
              name="status"
              value={department.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-brand" onClick={addDepartment}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;
