import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FaTasks, FaFolderOpen } from "react-icons/fa";

const statusClass = (status) => {
  const key = (status || "").toLowerCase();
  if (key === "completed") return "status-completed";
  if (key === "in progress") return "status-progress";
  if (key === "pending" || key === "assigned") return "status-pending";
  if (key === "rejected") return "status-admin";
  return "status-progress";
};

const MyTasks = () => {

  const { user } = useSelector((state) => state.auth);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const getMyAssignments = async () => {
    try {
      const res = await axiosInstance.get("/assign/getAllAssignments");
      const all = res.data.assignments || [];

      const mine = all.filter((a) => a.user_id?._id === user?._id);
      setAssignments(mine);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getMyAssignments();
    }
  }, [user]);

  const updateStatus = async (assignmentId, status) => {
    setUpdatingId(assignmentId);

    try {
      await axiosInstance.patch(`/assign/updateAssignmentStatus/${assignmentId}`, { status });
      toast.success(`Marked as ${status}`);
      getMyAssignments();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="my-tasks-page">

      <span className="page-eyebrow">My work</span>
      <h2 className="page-title mb-4">My Assigned Tasks</h2>

      <div className="table-card">

        {loading ? (
          <div className="empty-state">Loading your tasks...</div>
        ) : assignments.length === 0 ? (
          <div className="empty-state">
            <FaTasks size={26} style={{ marginBottom: 10, color: "var(--muted)" }} />
            <h5>Nothing assigned to you yet</h5>
            <p>When an admin or HOD assigns you a task, it'll show up here.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assignments.map((a) => (
                <tr key={a._id}>
                  <td>
                    <strong>{a.task_id?.title}</strong>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
                      {a.task_id?.description}
                    </div>
                  </td>

                  <td>
                    <span className="d-flex align-items-center gap-2">
                      <FaFolderOpen size={13} color="var(--muted)" />
                      {a.task_id?.project_ID?.title || "—"}
                    </span>
                  </td>

                  <td>
                    {a.task_id?.endDate
                      ? new Date(a.task_id.endDate).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <span className={`status ${statusClass(a.status)}`}>
                      {a.status}
                    </span>
                  </td>

                  <td>
                    {a.status === "Assigned" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn-ghost"
                          style={{ padding: "6px 12px", fontSize: 12.5 }}
                          disabled={updatingId === a._id}
                          onClick={() => updateStatus(a._id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn-ghost"
                          style={{ padding: "6px 12px", fontSize: 12.5 }}
                          disabled={updatingId === a._id}
                          onClick={() => updateStatus(a._id, "Rejected")}
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {a.status === "Accepted" && (
                      <button
                        className="btn-brand"
                        style={{ padding: "6px 12px", fontSize: 12.5 }}
                        disabled={updatingId === a._id}
                        onClick={() => updateStatus(a._id, "Completed")}
                      >
                        Mark complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
