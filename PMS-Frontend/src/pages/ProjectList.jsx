import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import AssignTaskModal from "../components/AssignTaskModal";
import { toast } from "react-toastify";

import {
  FaEdit,
  FaTrash,
  FaProjectDiagram,
  FaUserPlus
} from "react-icons/fa";

const statusClass = (status) => {
  const key = (status || "").toLowerCase();
  if (key === "completed") return "status-completed";
  if (key === "in-progress") return "status-progress";
  if (key === "pending") return "status-pending";
  return "status-progress";
};

const ProjectList = () => {

  const { user } = useSelector((state) => state.auth);
  const canAssign = user?.role === "admin" || user?.role === "HOD";

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [assignProject, setAssignProject] = useState(null);

  const [editProject, setEditProject] = useState({
    id: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    department: "",
    status: "Pending"
  });

  const getProjects = async () => {
    try {
      const res = await axiosInstance.get("/project/getAll");
      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleEdit = (project) => {
    setEditProject({
      id: project._id,
      title: project.title,
      description: project.description,
      startDate: project.startDate.substring(0, 10),
      endDate: project.endDate.substring(0, 10),
      department: project.department,
      status: project.status || "Pending"
    });

    setShowModal(true);
  };

  const updateProject = async () => {
    try {
      await axiosInstance.put(`/project/updateproject/${editProject.id}`, {
        title: editProject.title,
        description: editProject.description,
        startDate: editProject.startDate,
        endDate: editProject.endDate,
        department: editProject.department,
        status: editProject.status
      });

      setShowModal(false);
      getProjects();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Failed to update project");
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        await axiosInstance.delete(`/project/delete/${id}`);
        getProjects();
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.msg || "Failed to delete project");
      }
    }
  };

  return (
    <div className="project-page">

      <span className="page-eyebrow">Projects</span>
      <h2 className="page-title mb-4">All Projects</h2>

      <div className="table-card">

        {projects.length === 0 ? (
          <div className="empty-state">
            <FaProjectDiagram size={26} style={{ marginBottom: 10, color: "var(--muted)" }} />
            <h5>No projects yet</h5>
            <p>Create your first project to see it listed here.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.title}</td>
                  <td>{project.department}</td>
                  <td>
                    <span className={`status ${statusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{new Date(project.startDate).toLocaleDateString()}</td>
                  <td>{new Date(project.endDate).toLocaleDateString()}</td>
                  <td>
                    {canAssign && (
                      <button
                        className="icon-btn"
                        title="Assign task"
                        onClick={() => setAssignProject(project)}
                      >
                        <FaUserPlus />
                      </button>
                    )}

                    <button className="edit-btn" onClick={() => handleEdit(project)}>
                      <FaEdit />
                    </button>

                    <button className="delete-btn" onClick={() => deleteProject(project._id)}>
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
            <h3>Edit Project</h3>

            <label className="form-label">Title</label>
            <input
              className="form-control mb-3"
              value={editProject.title}
              onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
            />

            <label className="form-label">Description</label>
            <textarea
              className="form-control mb-3"
              value={editProject.description}
              onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
            />

            <label className="form-label">Start date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={editProject.startDate}
              onChange={(e) => setEditProject({ ...editProject, startDate: e.target.value })}
            />

            <label className="form-label">End date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={editProject.endDate}
              onChange={(e) => setEditProject({ ...editProject, endDate: e.target.value })}
            />

            <label className="form-label">Department</label>
            <select
              className="form-select mb-3"
              value={editProject.department}
              onChange={(e) => setEditProject({ ...editProject, department: e.target.value })}
            >
              <option>Development</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Cloud</option>
              <option>Information Technology</option>
            </select>

            <label className="form-label">Status</label>
            <select
              className="form-select mb-3"
              value={editProject.status}
              onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="In-progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-brand" onClick={updateProject}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {assignProject && (
        <AssignTaskModal
          project={assignProject}
          onClose={() => setAssignProject(null)}
          onAssigned={getProjects}
        />
      )}

    </div>
  );
};

export default ProjectList;
