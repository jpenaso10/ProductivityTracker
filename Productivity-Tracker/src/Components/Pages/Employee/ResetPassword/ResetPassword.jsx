import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Token:", token); // Debug log to check token
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/auth/reset-password/${token}`, {
        password,
      })
      .then((response) => {
        if (response.data.status) {
          navigate("/");
        }
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form action="/" onSubmit={handleSubmit}>
          <FaLock className="icon-lock" />
          <h1 id="icon">Reset Password</h1>

          <div className="input-box">
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <button type="submit">Reset</button>

          <div className="register-link">
            <p>
              Don't have an account? <a href="/Signup">Sign Up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
