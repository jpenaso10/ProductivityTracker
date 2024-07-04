import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './Components/Pages/Profile/Profile'
import Login from './Components/Pages/Login/Login';
import Signup from './Components/Pages/Signup/Signup';
import Dashboard from './Components/Pages/Dashboard/Dashboard';
import ForgotPassword from './Components/Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/Pages/ResetPassword/ResetPassword';



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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
