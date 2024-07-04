import React, { useState } from "react";
import styles from "../Signup/Admin.module.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/auth/admin", {
        username,
        email,
        password,
      })
      .then((response) => {
        if (response.data.status) {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles["form-box"]} ${styles.login}`}>
        <form action="/" onSubmit={handleSubmit}>
          <h1>Admin</h1>
          <div className={styles["input-box"]}>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className={styles.icon} />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="icon" />
          </div>

          <div className={styles["input-box"]}>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className={styles.icon} />
          </div>

          <div className={styles["remember-forgot"]}>
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/forgotPassword">Forgot password?</a>
          </div>
          <button type="submit">Register</button>
          <div className={styles["register-link"]}></div>
        </form>
      </div>
    </div>
  );
}

export default Admin;
