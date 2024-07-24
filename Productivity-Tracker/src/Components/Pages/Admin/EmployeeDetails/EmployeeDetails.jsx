import React, { useEffect, useState } from "react";
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

function EmployeeDetails() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  axios.defaults.withCredentials = true;

  const [employees, setEmployees] = useState([]);

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
