import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import styles from "./AdminTasks.module.css";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { VscSettingsGear } from "react-icons/vsc";
import { Navigate, useNavigate } from "react-router-dom";
import { MdAddTask } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function AdminTasks() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [status, setStatus] = useState("Unavailable");
  const dropdownRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    date: new Date(),
    priority: "",
  });

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/tasks")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks data!", error);
      });
  }, []);

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
        { withCredentials: true }
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

  const handleTaskSubmit = (taskData) => {
    axios
      .post("http://localhost:5000/auth/task", taskData)
      .then((response) => {
        if (response.data.status) {
          setTasks([...tasks, response.data.newTask]);
          setModalIsOpen(false);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error creating the task!", error);
      });
  };

  const handleTaskEdit = (taskData) => {
    if (!currentTaskId) {
      console.error("No task ID available for editing");
      return;
    }
  
    console.log("Editing task with ID:", currentTaskId);
    console.log("Task data to update:", taskData);
  
    axios
      .put(`http://localhost:5000/auth/tasks/${currentTaskId}`, taskData)
      .then((response) => {
        console.log("Response from task edit:", response.data);
        if (response.data.status && response.data.updatedTask) {
          setTasks(
            tasks.map((task) =>
              task._id === currentTaskId ? response.data.updatedTask : task
            )
          );
          setModalIsOpen(false);
          setIsEditing(false);
          setCurrentTaskId(null);
        } else {
          console.error("Error updating task:", response.data.message || "Unknown error");
          alert(response.data.message || "Error updating task");
        }
      })
      .catch((error) => {
        console.error("There was an error editing the task!", error);
      });
  };
  
  
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setTaskData((prevData) => ({
      ...prevData,
      date: date,
    }));
  };

  const handleDelete = async (_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/auth/tasks/${_id}`
      );
      if (response.status === 200) {
        setTasks(tasks.filter((task) => task._id !== _id));
        console.log("Task deleted successfully");
      } else {
        console.error("Failed to delete task:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleTaskEdit(taskData);
    } else {
      handleTaskSubmit(taskData);
    }
  };

  const handleEditButtonClick = (task) => {
    if (!task || !task._id) {
      console.error("Task or Task ID is undefined");
      return;
    }
  
    setTaskData({
      name: task.name || "",
      description: task.description || "",
      date: new Date(task.date) || new Date(),
      priority: task.priority || "",
    });
    setCurrentTaskId(task._id);
    setIsEditing(true);
    setModalIsOpen(true);
  };

  const getPriorityClass = (priority) => {
    if (!priority) return ""; // Default to no class if priority is undefined
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
              <a href="./AdminDashboard">
                <CgMenuLeftAlt />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/AdminTasks">
                <MdAddTask />
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a href="/AdminUsers">
                <FaUsers />
                <span>Users</span>
              </a>
            </li>
            <li>
              <a href="./Settings">
                <VscSettingsGear />
                <span>Settings</span>
              </a>
            </li>
            <li className={styles.logout}>
              <a href="#" onClick={handleLogout}>
                <BiLogOut />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.maincontent}>
          <div className={styles.headerwrapper}>
            <div className={styles.headertitle}>
              <span>ADMIN</span>
              <h2>Tasks</h2>
            </div>
            <div className={styles.userinfo}>
              <div className={styles.searchbox}>
                <FaSearch />
                <input type="text" placeholder="Search" />
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
                    <li onClick={() => handleStatusChangeCode("Production")}>
                      Production
                    </li>
                    <li onClick={() => handleStatusChangeCode("Meeting")}>
                      Meeting
                    </li>
                    <li onClick={() => handleStatusChangeCode("Coaching")}>
                      Coaching
                    </li>
                    <li onClick={() => handleStatusChangeCode("Lunch")}>
                      Lunch
                    </li>
                    <li onClick={() => handleStatusChangeCode("Break")}>
                      Break
                    </li>
                    <li onClick={() => handleStatusChangeCode("Unavailable")}>
                      Unavailable
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mainnav}>
            <nav>
              <button
                className={styles.navbutton}
                onClick={() => {
                  setIsEditing(false);
                  setTaskData({
                    name: "",
                    description: "",
                    date: new Date(),
                    priority: "",
                  });
                  setModalIsOpen(true);
                }}
              >
                Create Task
              </button>
              <button className={styles.navbutton}> Sample</button>
              <button className={styles.navbutton}> sample</button>
            </nav>
          </div>

          <div className={styles.tasks}>
          {tasks.length > 0 ? (
  tasks.map((task) => {
    if (!task) return null; // Ensure task is defined
    return (
      <div
        className={`${styles.taskCard} ${getPriorityClass(task.priority)}`}
        key={task._id}
      >
        <div className={styles.taskDetails}>
          <p
            className={`${styles.status} ${
              task.status === "Active"
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
          <button
            onClick={() => handleEditButtonClick(task)}
            className={styles.actionButton}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(task._id)}
            className={styles.actionButton}
          >
            Delete
          </button>
        </div>
      </div>
    );
  })
) : (
  <p>No tasks found.</p>
)}

          </div>
        </div>
      </body>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>{isEditing ? "Edit Task" : "Create Task"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={taskData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              className={styles.fixedTextarea}
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Due Date:</label>
            <DatePicker
              selected={taskData.date}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              required
            />
          </div>
          <div>
            <label className={styles.option}>Priority:</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleInputChange}
              required
            >
              <option className={styles.option} value="">
                Select Priority
              </option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button type="submit">
            {isEditing ? "Update Task" : "Create Task"}
          </button>
          <button type="button" onClick={() => setModalIsOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminTasks;
