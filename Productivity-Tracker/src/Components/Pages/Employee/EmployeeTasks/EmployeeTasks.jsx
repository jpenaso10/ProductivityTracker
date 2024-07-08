import React, { useState, useEffect } from 'react';
import styles from './EmployeeTasks.module.css';
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { CgProfile, CgMenuLeftAlt, CgMenuGridR } from "react-icons/cg";
import { GoQuestion } from "react-icons/go";
import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { BsListTask } from "react-icons/bs";
import axios from 'axios';

function EmployeeTasks() {
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

  ''
  return (
    <div>
      <body>
        <div className={styles.sidebar}>
          <div className={styles.logo}></div>
          <ul className={styles.menu}>
            <li>
              <a href="./Dashboard">
                <CgMenuGridR style={{ fontSize: '1.2rem' }} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Profile">
                <CgProfile style={{ fontSize: '1.1rem' }} />
                <span>Profile</span>
              </a>
            </li>
            <li className={styles.active}>
              <a href="./EmployeeTasks">
                <BsListTask style={{ fontSize: '1.1rem' }} />
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a href="#">
                <GoQuestion style={{ fontSize: '1.1rem' }} />
                <span>FAQ</span>
              </a>
            </li>
            <li>
              <a href="./Settings">
                <VscSettingsGear style={{ fontSize: '1.1rem' }} />
                <span>Settings</span>
              </a>
            </li>
            <li className={styles.logout}>
              <a href="/">
                <BiLogOut style={{ fontSize: '1.3rem' }} />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.maincontent}>
          <div className={styles.headerwrapper}>
            <div className={styles.headertitle}>
              <span>Productivity Tracker</span>
              <h2>Tasks</h2>
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

export default EmployeeTasks;
