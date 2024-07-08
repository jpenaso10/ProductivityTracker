import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./Components/Pages/Employee/Profile/Profile";
import Login from "./Components/Pages/Employee/Login/Login";
import Signup from "./Components/Pages/Employee/Signup/Signup";
import Dashboard from "./Components/Pages/Employee/Dashboard/Dashboard";
import ForgotPassword from "./Components/Pages/Employee/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/Pages/Employee/ResetPassword/ResetPassword";
import Settings from "./Components/Pages/Employee/Settings/Settings";
import Admin from "./Components/Pages/Admin/Signup/AdminSignup";
import AdminDashboard from "./Components/Pages/Admin/AdminDashboard/AdminDashboard";
import AdminTasks from "./Components/Pages/Admin/Tasks/AdminTasks";
import EmployeeTasks from "./Components/Pages/Employee/EmployeeTasks/EmployeeTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminTasks" element={<AdminTasks />} />
        <Route path="/EmployeeTasks" element={<EmployeeTasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
