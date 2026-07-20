import React, { useEffect } from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getUserInfo } from "./redux/authSlice";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/ProjectList";
import CreateProject from "./pages/CreateProject";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Users from "./pages/Users";
import Department from "./components/Department";
import Profile from "./pages/Profile";
import MyTasks from "./pages/MyTasks";


const App = () => {

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  // Rehydrate the logged-in user on refresh / first load if a token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(getUserInfo());
    }
  }, [token, user, dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projects" element={<ProjectList />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/my-tasks" element={<MyTasks />} />

            <Route element={<RoleRoute allowed={["admin", "HOD"]} />}>
              <Route path="/create-project" element={<CreateProject />} />
            </Route>

            <Route element={<RoleRoute allowed={["admin"]} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/departments" element={<Department />} />
            </Route>

          </Route>

        </Route>

      </Routes>
    </>
  );
};

export default App;
