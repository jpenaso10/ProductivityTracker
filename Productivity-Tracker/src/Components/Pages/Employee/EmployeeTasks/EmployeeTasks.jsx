import React, { useState, useEffect, useRef } from "react";
import styles from "./EmployeeTasks.module.css";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { CgProfile, CgMenuGridR } from "react-icons/cg";
import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MdAddTask } from "react-icons/md";
import axios from "axios";

axios.defaults.withCredentials = true;

function EmployeeTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentTab, setCurrentTab] = useState("To do");
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
    axios
      .get("http://localhost:5000/auth/tasks")
      .then((response) => {
        setTasks(response.data);
        filterTasks("To do", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks data!", error);
      });
  }, []);

  // FOR STATUS CODE CHANGE

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

  const toggleDropdown = () => {
    setDropdownVisible((prevVisible) => !prevVisible);
  };

  const handleStatusChangeCode = async (newStatus) => {
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

  // -------------------------------

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filterTasks = (status, allTasks = tasks) => {
    const filtered = allTasks.filter((task) => {
      if (status === "To do") {
        return task.status === "Active";
      }
      if (status === "Pending") {
        return task.status === "Pending";
      }
      if (status === "Completed") {
        return task.status === "Done";
      }
      return false;
    });
    setFilteredTasks(filtered);
  };

  const handleTabClick = (status) => {
    setCurrentTab(status);
    filterTasks(status);
  };

  const handleStatusChange = (taskId, newStatus) => {
    axios
      .put(`http://localhost:5000/auth/tasks/${taskId}`, { status: newStatus })
      .then((response) => {
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);
        filterTasks(currentTab, updatedTasks);
      })
      .catch((error) => {
        console.error("There was an error updating the task status!", error);
      });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return styles.highPriority;
      case "Medium":
        return styles.mediumPriority;
      case "Low":
        return styles.lowPriority;
      default:
        return "";
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
            <li>
              <a href="/Profile">
                <CgProfile style={{ fontSize: "1.1rem" }} />
                <span>Profile</span>
              </a>
            </li>
            <li className={styles.active}>
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
              <h2>Tasks</h2>
            </div>
            <div className={styles.userinfo}>
              <div className={styles.searchbox}>
                <FaSearch />
                <input type="text" placeholder="Search" />
              </div>
            </div>
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
                className={`${styles.statusIndicator} ${styles[status.toLowerCase()]
                  }`}
              ></div>
              <div
                className={`${styles.dropdown} ${dropdownVisible ? styles.show : ""
                  }`}
              >
                <ul>
                  <li onClick={() => handleStatusChangeCode("Production")}>
                    Production
                  </li>
                  <li onClick={() => handleStatusChangeCode("Meeting")}>
                    Meeting
                  </li>
                  <li onClick={() => handleStatusChangeCode("Coaching")}>
                    Coaching
                  </li>
                  <li onClick={() => handleStatusChangeCode("Lunch")}>Lunch</li>
                  <li onClick={() => handleStatusChangeCode("Break")}>Break</li>
                  <li onClick={() => handleStatusChangeCode("Unavailable")}>
                    Unavailable
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.mainnav}>
            <nav>
              <button
                className={styles.navbutton}
                onClick={() => handleTabClick("To do")}
              >
                To do
              </button>
              <button
                className={styles.navbutton}
                onClick={() => handleTabClick("Pending")}
              >
                Pending
              </button>
              <button
                className={styles.navbutton}
                onClick={() => handleTabClick("Completed")}
              >
                Completed
              </button>
            </nav>
          </div>

          <div className={styles.tasks}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  className={`${styles.taskCard} ${getPriorityClass(
                    task.priority
                  )}`}
                  key={task._id}
                >
                  <div className={styles.taskDetails}>
                    <p
                      className={`${styles.status} ${task.status === "Active"
                          ? styles.statusActive
                          : task.status === "Pending"
                            ? styles.statusPending
                            : task.status === "Done"
                              ? styles.statusDone
                              : ""
                        }`}
                    >
                      {task.status}
                    </p>
                    <h3 className={styles.taskName}>{task.name}</h3>
                    <p className={styles.taskDescription}>{task.description}</p>
                    <p className={styles.taskDate}>
                      Due: {new Date(task.date).toLocaleDateString()}
                    </p>
                    <p className={styles.taskPriority}>
                      Priority: {task.priority}
                    </p>
                  </div>
                  <div className={styles.taskActions}>
                    {task.status === "Active" && (
                      <button
                        className={styles.actionButton}
                        onClick={() => handleStatusChange(task._id, "Pending")}
                      >
                        Start
                      </button>
                    )}
                    {task.status === "Pending" && (
                      <button
                        className={styles.actionButtoncomplete}
                        onClick={() => handleStatusChange(task._id, "Done")}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks found.</p>
            )}
          </div>
        </div>
      </body>
    </div>
  );
}

export default EmployeeTasks;
