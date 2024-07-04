import React, { useEffect } from 'react';
import styles from './Dashboard.module.css'
import { FaTachometerAlt, FaUser, FaChartBar, FaBriefcase, FaQuestionCircle, FaCog, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { BiAlarm } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { CgMenuGridR } from "react-icons/cg";
import { GoQuestion } from "react-icons/go";
import { VscSettingsGear } from "react-icons/vsc";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate()
    axios.defaults.withCredentials = true

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
                <a href="./Dashboard">
                  <CgMenuLeftAlt />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/Profile">
                  <CgProfile />
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <GoQuestion />
                  <span>FAQ</span>
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
                <span>Primary</span>
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

export default Dashboard;
