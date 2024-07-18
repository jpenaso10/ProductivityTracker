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
import Stopwatch, {start, stop, reset} from "./Stopwatch.jsx";

function Dashboard() {
  const navigate = useNavigate();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [status, setStatus] = useState("Unavailable");

  const dropdownRef = useRef(null);

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

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:5000/auth/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

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
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const toggleDropdown = () => {
    setDropdownVisible((prevVisible) => !prevVisible);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setDropdownVisible(false); // Close dropdown after selecting a status
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
              <span>Dashboard</span>
              <h2>Productivity Tracker</h2>
            </div>
            <DigitalClock/>
            <div className={styles.timerButtonWrapper}>
              <button
                className={`${styles.timerButton} ${
                  isTimerRunning ? styles.endShiftButton : ""
                }`}
                onClick={toggleTimer}
              >
                {isTimerRunning ? "End Shift" : "Start Shift"}
              </button>
              <div className={styles.timerDisplay}>{formatTime(time)}</div>
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
                  {/*<ul>
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
                  </ul>*/}
                    <button onClick={() => handleStatusChange("Production")}>
                      Production
                    </button><br></br>
                    <button onClick={() => handleStatusChange("Meeting")}>
                      Meeting
                    </button><br></br>
                    <button onClick={() => handleStatusChange("Coaching")}>
                      Coaching
                    </button><br></br>
                    <button onClick={() => handleStatusChange("Lunch")}>Lunch</button><br></br>
                    <button onClick={() => handleStatusChange("Break")}>Break</button><br></br>
                    <button onClick={() => handleStatusChange("Unavailable")}>
                      Unavailable
                    </button>
                </div>
              </div>
            </div> {/*end div for status*/}
          </div>
          <div className={styles.mainnav}>
            <h3>Your shift</h3>
            <p>Your time spent in status codes on "insert date here"</p>
          </div>
          <div className={styles.timechart}>
            <h1>TIME CHART HERE</h1>
          </div>
          <div className={styles.statusContainer}>
            <div className={styles.statusprod}>
              <p>Production</p>
              <Stopwatch />
              {/*<p>00:00</p>*/}
            </div>
            <div className={styles.statusmeeting}>
              <p>Meeting</p>
              <Stopwatch/> {/*<p>00:00</p>*/}
            </div>
            <div className={styles.statuscoaching}>
              <p>Coaching</p>
              <Stopwatch/> {/*<p>00:00</p>*/}
            </div>
            <div className={styles.statuslunch}>
              <p>Lunch</p>
              <Stopwatch/> {/*<p>00:00</p>*/}
            </div>
            <div className={styles.statusbreak}>
              <p>Break</p>
              <Stopwatch/> {/*<p>00:00</p>*/}
            </div>
            <div className={styles.statusunavail}>
              <p>Unavailable</p>
              <Stopwatch/> {/*<p>00:00</p>*/}
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default Dashboard;
