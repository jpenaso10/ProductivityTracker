import React, { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { CgProfile, CgMenuLeftAlt, CgMenuGridR } from "react-icons/cg";
import { GoQuestion } from "react-icons/go";
import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MdAddTask } from "react-icons/md";
import axios from "axios";
import DigitalClock from "./DigitalClock";

axios.defaults.withCredentials = true;

function Dashboard() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [status, setStatus] = useState("Unavailable");
  const [statusTimers, setStatusTimers] = useState({
    Production: 0,
    Meeting: 0,
    Coaching: 0,
    Lunch: 0,
    Break: 0,
    Unavailable: 0,
    current: 0,
  });
  const dropdownRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [currentStatusStartTime, setCurrentStatusStartTime] = useState(null);
  const [currentTimerInterval, setCurrentTimerInterval] = useState(null);

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

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
          await loadTimersFromDatabase(); // Load timers after user is verified
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

  // FETCH CURRENT DATE

  useEffect(() => {
    // Function to format and set the current date
    const updateCurrentDate = () => {
      const now = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      setCurrentDate(now.toLocaleDateString(undefined, options));
    };

    updateCurrentDate(); // Set the date when the component mounts
  }, []);

  //---------------------------------------------------------------------

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

  const handleLogout = async () => {
    try {
      await saveTimersToDatabase(); // Save timers before logging out
      await axios.post("http://localhost:5000/auth/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning((prevState) => !prevState);
    if (isTimerRunning) {
      setTime(0);
    }
  };

  const handleTaskStart = () => {
    setIsTaskActive((prevState) => !prevState);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleDropdown = () => {
    setDropdownVisible((prevVisible) => !prevVisible);
  };

  // STATUS CHANGE

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/auth/update-status",
        { status: newStatus },
        { withCredentials: true }
      );
      if (!response.data.success) {
        console.error("Failed to update status:", response.data);
      } else {
        console.log("Status updated successfully:", response.data);
        stopCurrentTimer(); // Stop the current timer
        updateStatusTimers(newStatus); // Update timers
        setStatus(newStatus); // Set new status
        await saveTimersToDatabase(); // Save updated timers
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const updateStatusTimers = (newStatus) => {
    setCurrentStatusStartTime(new Date());
    // We don't start a new timer here anymore
  };

  useEffect(() => {
    return () => {
      stopCurrentTimer();
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (currentStatusStartTime) {
      intervalId = setInterval(() => {
        const now = new Date();
        const timeSpent = Math.floor((now - currentStatusStartTime) / 1000);
        setStatusTimers((prevTimers) => ({
          ...prevTimers,
          [status]: prevTimers[status] + timeSpent,
          current: timeSpent,
        }));
      }, 1000); // Update every second for accuracy
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status, currentStatusStartTime]);

  const stopCurrentTimer = () => {
    if (currentTimerInterval) {
      clearInterval(currentTimerInterval);
      setCurrentTimerInterval(null);
    }
    if (currentStatusStartTime) {
      const now = new Date();
      const timeSpent = Math.floor((now - currentStatusStartTime) / 1000);
      setStatusTimers((prevTimers) => ({
        ...prevTimers,
        [status]: prevTimers[status] + timeSpent,
        current: 0,
      }));
      setCurrentStatusStartTime(null);
    }
  };

  const getTotalTime = (statusKey) => {
    return statusKey === status
      ? statusTimers[statusKey] + statusTimers.current
      : statusTimers[statusKey];
  };

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // SAVE THE TIMER IN DATABASE

  const saveTimersToDatabase = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const timersToSave = {
        Production: getTotalTime("Production"),
        Meeting: getTotalTime("Meeting"),
        Coaching: getTotalTime("Coaching"),
        Lunch: getTotalTime("Lunch"),
        Break: getTotalTime("Break"),
        Unavailable: getTotalTime("Unavailable"),
      };

      const response = await axios.post(
        "http://localhost:5000/auth/save-timers",
        {
          date: currentDate,
          timers: timersToSave,
          currentStatus: status,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log("Timer data saved successfully");
      } else {
        console.error("Failed to save timer data");
      }
    } catch (error) {
      console.error("Error saving timer data:", error);
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
        setStatusTimers((prevTimers) => ({
          ...prevTimers,
          ...response.data.timers,
          current: 0, // Reset current to 0 as we'll start counting from now
        }));
        // Set the current status start time to now
        setCurrentStatusStartTime(new Date());
        setStatus(response.data.currentStatus || "Unavailable");
      } else {
        console.log("No timer data for today, starting fresh");
        // If no data, keep the default state (all zeros)
      }
    } catch (error) {
      console.error("Error loading timer data:", error);
    }
  };

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveTimersToDatabase();
    }, 5 * 60 * 1000); // Save every 5 minutes

    return () => clearInterval(saveInterval);
  }, []);

  useEffect(() => {
    let lastSavedDate = new Date().toISOString().split("T")[0];

    const saveInterval = setInterval(async () => {
      const currentDate = new Date().toISOString().split("T")[0];
      if (currentDate !== lastSavedDate) {
        // It's a new day, reset timers and update lastSavedDate
        setStatusTimers({
          Production: 0,
          Meeting: 0,
          Coaching: 0,
          Lunch: 0,
          Break: 0,
          Unavailable: 0,
          current: 0,
        });
        lastSavedDate = currentDate;
      }
      await saveTimersToDatabase();
    }, 5 * 60 * 1000); // Save every 5 minutes

    return () => clearInterval(saveInterval);
  }, []);
  //-------------------------------------------------------

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
              <p>{formatTime(getTotalTime("Production"))}</p>
            </div>
            <div className={styles.statusmeeting}>
              <p>Meeting</p>
              <p>{formatTime(getTotalTime("Meeting"))}</p>
            </div>
            <div className={styles.statuscoaching}>
              <p>Coaching</p>
              <p>{formatTime(getTotalTime("Coaching"))}</p>
            </div>
            <div className={styles.statuslunch}>
              <p>Lunch</p>
              <p>{formatTime(getTotalTime("Lunch"))}</p>
            </div>
            <div className={styles.statusbreak}>
              <p>Break</p>
              <p>{formatTime(getTotalTime("Break"))}</p>
            </div>
            <div className={styles.statusunavail}>
              <p>Unavailable</p>
              <p>{formatTime(getTotalTime("Unavailable"))}</p>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default Dashboard;
