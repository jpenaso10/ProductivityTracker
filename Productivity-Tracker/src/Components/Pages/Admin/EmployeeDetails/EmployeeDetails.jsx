import React, { useState, useEffect, useRef } from "react";
import styles from "./EmployeeDetails.module.css";
import Modal from "react-modal";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { VscSettingsGear } from "react-icons/vsc";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MdAddTask } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import axios from "axios";
Modal.setAppElement("#root");

axios.defaults.withCredentials = true;

function EmployeeDetails() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [status, setStatus] = useState("Unavailable");
  const dropdownRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the employee data!", error);
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

  const [employeeData, setEmployeeData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "not working",
    firstName: "",
    lastName: "",
    gender: "",
    role: "",
    contactNumber: "",
    profilePicture: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleFileChange = (e) => {
    setEmployeeData({ ...employeeData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employeeData.password !== employeeData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const formData = new FormData();
    for (const key in employeeData) {
      formData.append(key, employeeData[key]);
    }

    axios
      .post("http://localhost:5000/auth/signup", formData)
      .then((response) => {
        if (response.data.status) {
          setEmployees((prevEmployees) => [
            ...prevEmployees,
            response.data.newEmployee,
          ]); // Add the new employee to the list
          setModalIsOpen(false);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      });
  };

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

  // -------------------------------

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
              <a href="/AdminProfile">
                <CgProfile />
                <span>Profile</span>
              </a>
            </li>
            <li className={styles.active}>
              <a href="/EmployeeDetails">
                <FaUsers />
                <span>Employee</span>
              </a>
            </li>
            <li>
              <a href="/AdminTasks">
                <MdAddTask />
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
              <span>ADMIN</span>
              <h2>Employee Information</h2>
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
                onClick={() => setModalIsOpen(true)}
              >
                New Employee
              </button>
              <button className={styles.navbutton}> Sample</button>
              <button className={styles.navbutton}> sample</button>
            </nav>
          </div>

          <div className={styles.employeeDetails}>
            <h3>Employee Details</h3>
            {employees.length > 0 ? (
              <table className={styles.employeeTable}>
                <thead>
                  <tr>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) =>
                    employee ? (
                      <tr key={employee._id}>
                        <td>{employee.lastName}</td>
                        <td>{employee.firstName}</td>
                        <td>{employee.email}</td>
                        <td>{employee.role}</td>
                        <td>{employee.status}</td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            ) : (
              <p>No employees found.</p>
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
        <h2>New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={employeeData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={employeeData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={employeeData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={employeeData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Role:</label>

            <input
              type="radio"
              id="adminRole"
              name="role"
              value="Admin"
              checked={employeeData.role === "Admin"}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="adminRole">Admin</label>

            <input
              type="radio"
              id="employeeRole"
              name="role"
              value="Employee"
              checked={employeeData.role === "Employee"}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="employeeRole">Employee</label>
            <br />
          </div>
          <div>
            <label>Contact Number:</label>
            <input
              type="tel"
              name="contactNumber"
              value={employeeData.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={employeeData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={employeeData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={employeeData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setModalIsOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default EmployeeDetails;
