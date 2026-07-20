import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

import {
  FaProjectDiagram,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaUserCircle,
  FaUsers,
  FaTasks,
  FaFolderOpen,
  FaListUl
} from "react-icons/fa";

const Dashboard = () => {

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [data, setData] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    pendingProjects: 0
  });

  const getDashboardData = async () => {
    try {
      const total = await axiosInstance.get("/project/getTotalprojects");
      const completed = await axiosInstance.get("/project/getTotalCompletedproject");
      const inProgress = await axiosInstance.get("/project/getTotalInprogressproject");
      const pending = await axiosInstance.get("/project/getTotalPendingProjects");

      setData({
        totalProjects: total.data.totalProjects,
        completedProjects: completed.data.totalCompletedProjects,
        inProgressProjects: inProgress.data.totalInprogressProjects,
        pendingProjects: pending.data.totalPendingProjects
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Projects",
      value: data.totalProjects,
      icon: <FaProjectDiagram size={18} />,
      accent: "accent-total"
    },
    {
      label: "Completed",
      value: data.completedProjects,
      icon: <FaCheckCircle size={18} />,
      accent: "accent-completed"
    },
    {
      label: "In Progress",
      value: data.inProgressProjects,
      icon: <FaSpinner size={18} />,
      accent: "accent-progress"
    },
    {
      label: "Pending",
      value: data.pendingProjects,
      icon: <FaClock size={18} />,
      accent: "accent-pending"
    }
  ];

  const actionsByRole = {
    admin: [
      { title: "Manage users", sub: "Add, edit or deactivate accounts", icon: <FaUsers size={18} />, tone: "tone-brand", to: "/users" },
      { title: "Manage projects", sub: "Create and track every project", icon: <FaFolderOpen size={18} />, tone: "tone-slate", to: "/projects" },
      { title: "Departments", sub: "Organize projects by department", icon: <FaTasks size={18} />, tone: "tone-amber", to: "/departments" },
    ],
    HOD: [
      { title: "Department projects", sub: "See projects in your department", icon: <FaFolderOpen size={18} />, tone: "tone-brand", to: "/projects" },
      { title: "Create project", sub: "Start a new project for your team", icon: <FaTasks size={18} />, tone: "tone-slate", to: "/create-project" },
    ],
    user: [
      { title: "My tasks", sub: "See what's assigned to you", icon: <FaListUl size={18} />, tone: "tone-brand", to: "/my-tasks" },
    ],
  };

  const actions = actionsByRole[user?.role] || actionsByRole.user;

  return (
    <div className="dashboard">

      <span className="page-eyebrow">Overview</span>
      <h2 className="page-title mb-4">
        Welcome back{user?.name ? `, ${user.name}` : ""}
      </h2>

      <div className="profile-card p-4 mb-4 d-flex align-items-center gap-3">
        {user?.imgPath ? (
          <img
            src={user.imgPath}
            alt="Profile"
            width="60"
            height="60"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <FaUserCircle size={54} color="var(--muted)" />
        )}

        <div>
          <h5 className="mb-1">{user?.name}</h5>
          <span className={`status ${user?.role === "admin" ? "status-admin" : user?.role === "HOD" ? "status-hod" : "status-user"}`}>
            {user?.role}
          </span>
          <p className="text-muted mt-2 mb-0" style={{ fontSize: 13.5 }}>{user?.email}</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat) => (
          <div className="col-md-3" key={stat.label}>
            <div className={`dashboard-card ${stat.accent}`}>
              <div className="stat-icon">{stat.icon}</div>
              <h5>{stat.label}</h5>
              <h2>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <span className="page-eyebrow d-block">Quick actions</span>
      <h5 className="mb-3">What would you like to do?</h5>

      <div className="row g-3">
        {actions.map((action) => (
          <div key={action.title} className="col-md-4">
            <button
              className={`action-card ${action.tone}`}
              onClick={() => navigate(action.to)}
            >
              <span className="action-icon">{action.icon}</span>
              <span>
                <span className="action-title d-block">{action.title}</span>
                <span className="action-sub">{action.sub}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
