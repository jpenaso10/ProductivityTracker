import React, { useState, useEffect, useRef } from "react";
import styles from "./Profile.module.css";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { CgMenuGridR } from "react-icons/cg";
import { GoQuestion } from "react-icons/go";
import { VscSettingsGear } from "react-icons/vsc";
import { Navigate, useNavigate } from "react-router-dom";
import { MdAddTask } from "react-icons/md";
import axios from "axios";
import UserProfileEdit from "./UserProfileEdit.jsx";

function Profile() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [isTaskActive, setIsTaskActive] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [status, setStatus] = useState("Unavailable");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTaskStart = () => {
    setIsTaskActive((prevState) => !prevState);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prevVisible) => !prevVisible);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setDropdownVisible(false); // Close dropdown after selecting a status
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <body>
        <div className={styles.sidebar}>
          <div className={styles.logo}></div>
          <ul className={styles.menu}>
            <li>
              <a href="./Dashboard">
                <CgMenuGridR style={{ fontSize: "1.2rem" }} />
                <span>Dashboard</span>
              </a>
            </li>
            <li className={styles.active}>
              <a href="./Profile">
                <CgProfile style={{ fontSize: "1.1rem" }} />
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a href="./EmployeeTasks">
                <MdAddTask style={{ fontSize: "1.1rem" }} />
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a href="./Settings">
                <VscSettingsGear style={{ fontSize: "1.1rem" }} />
                <span>Settings</span>
              </a>
            </li>
            <li className={styles.logout}>
              <a href="#" onClick={handleLogout}>
                <BiLogOut style={{ fontSize: "1.3rem" }} />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.maincontent}>
          <div className={styles.headerwrapper}>
            <div className={styles.headertitle}>
              <span>Primary</span>
              <h2>Profile</h2>
            </div>
            <div className={styles.userinfo}>
              <div className={styles.profile} ref={dropdownRef}>
                <img src="https://via.placeholder.com/40" alt="Profile" />
                <span onClick={toggleDropdown}>{status}</span>
                <div
                  className={`${styles.statusIndicator} ${
                    styles[status.toLowerCase()]
                  }`}
                ></div>
                <div
                  className={`${styles.dropdown} ${
                    dropdownVisible ? styles.show : ""
                  }`}
                >
                  <ul>
                    <li onClick={() => handleStatusChange("Production")}>
                      Production
                    </li>
                    <li onClick={() => handleStatusChange("Meeting")}>
                      Meeting
                    </li>
                    <li onClick={() => handleStatusChange("Coaching")}>
                      Coaching
                    </li>
                    <li onClick={() => handleStatusChange("Lunch")}>Lunch</li>
                    <li onClick={() => handleStatusChange("Break")}>Break</li>
                    <li onClick={() => handleStatusChange("Unavailable")}>
                      Unavailable
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <UserProfileEdit />
        </div>
      </body>
    </div>
  );
}

export default Profile;
