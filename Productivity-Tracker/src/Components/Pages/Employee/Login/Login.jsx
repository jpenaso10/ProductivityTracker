import React, { useState, useEffect } from "react";
import "./Login.css";
import { FaUser, FaEyeSlash } from "react-icons/fa"; // Import only FaUser and FaEyeSlash
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
          alert("Incorrect Username or Password. Please try again.");
        }
      })
      .catch((err) => console.log(err));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Productivity Tracker</h1>
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
            <FaEyeSlash
              className="icon"
              onClick={togglePasswordVisibility}
              style={{ color: showPassword ? "steelblue" : "black" }}
            />
          </div>

          <div className="remember-forgot">
            <label>
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
