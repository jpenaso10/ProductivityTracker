import React, { useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { VscSettingsGear } from "react-icons/vsc";
import { Navigate, useNavigate } from "react-router-dom";
import { MdAddTask } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  /*useEffect(() => {
        axios.get('http://localhost:5000/auth/verify')
        .then(res=> {
          if(res.data.status) {

          } else {
            navigate('/')
          }
        })
    }, []) */

  return (
    <div>
      <body>
        <div className={styles.sidebar}>
          <div className={styles.logo}></div>
          <ul className={styles.menu}>
            <li className={styles.active}>
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
            <li>
              <a href="/AdminTasks">
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
              <a href="/">
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
              <h2>Dashboard</h2>
            </div>
            <div className={styles.userinfo}>
              <div className={styles.searchbox}>
                <FaSearch />
                <input type="text" placeholder="Search" />
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default AdminDashboard;
