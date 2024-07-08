import React from 'react';
import styles from './Profile.module.css';
import { FaSearch } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { CgProfile, CgMenuGridR } from 'react-icons/cg';
import { GoQuestion } from 'react-icons/go';
import { VscSettingsGear } from 'react-icons/vsc';
import { MdAddTask } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

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
            <li className={styles.active}>
              <a href="./Profile">
                <CgProfile style={{ fontSize: '1.1rem' }} />
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a href="./EmployeeTasks">
                <MdAddTask style={{ fontSize: '1.1rem' }} />
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
              <span>Primary</span>
              <h2>Profile</h2>
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

export default Profile;
