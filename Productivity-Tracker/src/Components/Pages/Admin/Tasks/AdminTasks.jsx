import React, { useEffect, useState } from "react";
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

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks data!", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/");
      }
    });
  }, []);

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

  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    date: new Date(),
    priority: "",
  });

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
    handleTaskSubmit(taskData);
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
              <a href="./AdminDashboard">
                <CgMenuLeftAlt />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#">
                <CgProfile />
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a href="/EmployeeDetails">
                <FaUsers />
                <span>Employee</span>
              </a>
            </li>
            <li className={styles.active}>
              <a href="#">
                <MdAddTask />
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a href="#">
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
            </div>
          </div>

          <div className={styles.mainnav}>
            <nav>
              <button
                className={styles.navbutton}
                onClick={() => setModalIsOpen(true)}
              >
                Create Task
              </button>
              <button className={styles.navbutton}> Sample</button>
              <button className={styles.navbutton}> sample</button>
            </nav>
          </div>

          <div className={styles.tasks}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  className={`${styles.taskCard} ${getPriorityClass(
                    task.priority
                  )}`}
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
                    <button className={styles.actionButton}>Edit</button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className={styles.actionButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
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
        <h2>Create Task</h2>
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
          <button type="submit">Create Task</button>
          <button type="button" onClick={() => setModalIsOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminTasks;
