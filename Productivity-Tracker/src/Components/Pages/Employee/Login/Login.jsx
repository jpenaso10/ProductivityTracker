import "./Login.css";
import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("username");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/auth/login", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.status) {
          // Store token in localStorage
          localStorage.setItem("token", response.data.token);

          if (rememberMe) {
            localStorage.setItem("username", username);
          } else {
            localStorage.removeItem("username");
          }

          const role = response.data.role;
          if (role === "Admin") {
            navigate("/admindashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          alert(
            response.data.message ||
            "Incorrect Username or Password. Please try again."
          );
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message); // Show the error message from the server
        } else {
          console.error("Error during login:", err);
          alert("An error occurred during login. Please try again.");
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <div className="logo-container">
            <div className="logo-text">Productivity Tracker</div>
            <img src="/all-covered-svgrepo-com.png" alt="Productivity Tracker Logo" className="logo" />
            <img
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaEyeSlash className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaEye className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          <div className="remember-forgot">
            <label style={{ color: "black" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
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
