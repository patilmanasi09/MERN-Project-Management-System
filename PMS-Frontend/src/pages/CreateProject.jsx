import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

const CreateProject = () => {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    department: ""
  });

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/project/create", project);

      toast.success(res.data.msg || "Project created");

      setProject({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        department: ""
      });

      navigate("/projects");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Project creation failed");
    }
  };

  return (
    <div className="container py-0">

      <span className="page-eyebrow">New</span>
      <h2 className="page-title mb-4">Create Project</h2>

      <div className="form-card" style={{ maxWidth: 680 }}>
        <div className="form-card-header">
          <span className="page-eyebrow">Project details</span>
          <h3>Tell us about the project</h3>
        </div>

        <div className="form-card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Project title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={project.title}
                onChange={handleChange}
                placeholder="e.g. Internal HR portal revamp"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={project.description}
                onChange={handleChange}
                placeholder="What is this project about?"
                required
              ></textarea>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start date</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={project.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">End date</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={project.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Department</label>

              <select
                className="form-select"
                name="department"
                value={project.department}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                <option value="Development">Development</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Cloud">Cloud</option>
                <option value="Information Technology">
                  Information Technology
                </option>
              </select>
            </div>

            <button type="submit" className="btn-brand w-100 justify-content-center">
              Create project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
