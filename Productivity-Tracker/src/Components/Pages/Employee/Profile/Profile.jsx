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

axios.defaults.withCredentials = true;

function Profile() {
  const navigate = useNavigate();

  const [isTaskActive, setIsTaskActive] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [status, setStatus] = useState("Unavailable");
  const dropdownRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");

  //  VERIFY USER AND UPDATE REALTIME STATUS

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login page if no token
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        });

        if (response.data.status) {
          setStatus(response.data.status);
          if (response.data.profilePicture) {
            setProfilePicture(response.data.profilePicture);
          }
          if (response.data.username) {
            setUsername(response.data.username);
          }
        } else {
          navigate("/"); // Redirect to login if verification fails
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/"); // Redirect to login if an error occurs
      }
    };

    verifyUser();
  }, [navigate]);

  const fetchCurrentStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/auth/get-status",
        { withCredentials: true }
      );
      if (response.data.success) {
        setStatus(response.data.status);
      } else {
        console.error("Failed to fetch status:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching current status:", error);
    }
  };

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  // ---------------------------------------------------------

  // FETCH PROFILE PIC
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/verify");
        if (response.data.status) {
          setStatus(response.data.status);
          if (response.data.profilePicture) {
            setProfilePicture(response.data.profilePicture);
          }
          if (response.data.username) {
            setUsername(response.data.username);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // ----------------------------------------------------------
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

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/auth/update-status",
        { status: newStatus },
        { withCredentials: true } // Ensure cookies are sent with the request
      );
      if (!response.data.success) {
        console.error("Failed to update status:", response.data);
      } else {
        console.log("Status updated successfully:", response.data);
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
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
                {profilePicture ? (
                  <img
                    src={`http://localhost:5000/${profilePicture}`}
                    alt="Profile"
                  />
                ) : (
                  <div className={styles.initials}>{getInitials(username)}</div>
                )}
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
