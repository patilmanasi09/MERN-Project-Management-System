import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Wraps routes that should only be reachable by specific roles.
// Usage: <Route element={<RoleRoute allowed={["admin"]} />}> ... </Route>
const RoleRoute = ({ allowed }) => {

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";

  if (!allowed.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
