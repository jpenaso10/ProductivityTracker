import React, { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { BiLogOut } from "react-icons/bi";
import { CgProfile, CgMenuGridR } from "react-icons/cg";
import { MdAddTask } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DigitalClock from "./DigitalClock";

axios.defaults.withCredentials = true;

function Dashboard() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [status, setStatus] = useState("Unavailable");
  const dropdownRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [statusTimers, setStatusTimers] = useState({
    Production: 0,
    Meeting: 0,
    Coaching: 0,
    Lunch: 0,
    Break: 0,
    Unavailable: 0,
  });

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
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
          await loadTimersFromDatabase();
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/");
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    const updateCurrentDate = () => {
      const now = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      setCurrentDate(now.toLocaleDateString(undefined, options));
    };

    updateCurrentDate();
  }, []);

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

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible((prevVisible) => !prevVisible);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/update-status",
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        setStatus(newStatus);
        await loadTimersFromDatabase();
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Failed to update status:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const loadTimersFromDatabase = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `http://localhost:5000/auth/get-timers/${currentDate}`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.timers) {
        setStatusTimers(response.data.timers);
        setStatus(response.data.currentStatus || "Unavailable");
      } else {
        console.log("No timer data for today, starting fresh");
      }
    } catch (error) {
      console.error("Error loading timer data:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadTimersFromDatabase();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (seconds) => {
    // Ensure seconds is a whole number
    seconds = Math.round(seconds);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div>
      <body>
        <div className={styles.sidebar}>
          <div className={styles.logo}></div>
          <ul className={styles.menu}>
            <li className={styles.active}>
              <a href="./Dashboard">
                <CgMenuGridR style={{ fontSize: "1.2rem" }} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Profile">
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
              <span>Dashboard</span>
              <h2>Productivity Tracker</h2>
            </div>
            <DigitalClock />
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
          <div className={styles.mainnav}>
            <h3>Your shift</h3>
            <p>Your time spent in status codes on {currentDate}</p>
          </div>
          <div className={styles.timechart}>
            <h1>TIME CHART HERE</h1>
          </div>
          <div className={styles.statusContainer}>
            <div className={styles.statusprod}>
              <p>Production</p>
              <p>{formatTime(statusTimers.Production)}</p>
            </div>
            <div className={styles.statusmeeting}>
              <p>Meeting</p>
              <p>{formatTime(statusTimers.Meeting)}</p>
            </div>
            <div className={styles.statuscoaching}>
              <p>Coaching</p>
              <p>{formatTime(statusTimers.Coaching)}</p>
            </div>
            <div className={styles.statuslunch}>
              <p>Lunch</p>
              <p>{formatTime(statusTimers.Lunch)}</p>
            </div>
            <div className={styles.statusbreak}>
              <p>Break</p>
              <p>{formatTime(statusTimers.Break)}</p>
            </div>
            <div className={styles.statusunavail}>
              <p>Unavailable</p>
              <p>{formatTime(statusTimers.Unavailable)}</p>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default Dashboard;
