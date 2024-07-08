import React, { useState } from "react";
import "./Login.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/auth/login", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.status) {
          const role = response.data.role;
          if (role === "Admin") {
            navigate("/admindashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          alert("Incorrect Username or Password. Please try again.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form action="/" onSubmit={handleSubmit}>
          <h1>Productivity Tracker</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/forgotPassword">Forgot password?</a>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
