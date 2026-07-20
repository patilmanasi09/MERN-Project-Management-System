import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

// Creates a task under a project and assigns it to a user in one step.
const AssignTaskModal = ({ project, onClose, onAssigned }) => {

  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    userId: "",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get("/user/getAllUsers");
        setUsers(res.data.users || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId) {
      toast.error("Please choose someone to assign this task to");
      return;
    }

    setSubmitting(true);

    try {
      const taskData = new FormData();
      taskData.append("project_ID", project._id);
      taskData.append("title", form.title);
      taskData.append("description", form.description);
      taskData.append("startDate", form.startDate);
      taskData.append("endDate", form.endDate);

      const taskRes = await axiosInstance.post("/tasks/create", taskData);

      const newTaskId = taskRes.data.task._id;

      await axiosInstance.post("/assign/assignTask", {
        task_id: newTaskId,
        user_id: form.userId,
      });

      toast.success("Task created and assigned");

      if (onAssigned) onAssigned();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Failed to assign task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="edit-modal">
        <h3>Assign task · {project.title}</h3>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Task title</label>
          <input
            className="form-control mb-3"
            name="title"
            placeholder="e.g. Draft wireframes"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label className="form-label">Description</label>
          <textarea
            className="form-control mb-3"
            name="description"
            rows="3"
            placeholder="What needs to be done?"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Start date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-6 mb-3">
              <label className="form-label">End date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label className="form-label">Assign to</label>
          <select
            className="form-select mb-3"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
          >
            <option value="">Select a team member</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} · {u.role}
              </option>
            ))}
          </select>

          {form.userId && (
            <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 13, color: "var(--muted)" }}>
              <FaUserCircle size={16} />
              Assigning to {users.find((u) => u._id === form.userId)?.name}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-brand" disabled={submitting}>
              {submitting ? "Assigning..." : "Create & assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
