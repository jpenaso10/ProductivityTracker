import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { CgProfile, CgMenuLeftAlt, CgMenuGridR } from "react-icons/cg";
import { GoQuestion } from "react-icons/go";
import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
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
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isTaskActive, setIsTaskActive] = useState(false); // State for task status

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(prevState => !prevState);
    if (isTimerRunning) {
      setTime(0);
    }

  };

  const handleTaskStart = () => {
    setIsTaskActive(prevState => !prevState); // Toggle task active status
  };

  const formatTime = (seconds) => {
    const getSeconds = `0${(seconds % 60)}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <div>
      <body>
        <div className={styles.sidebar}>
          <div className={styles.logo}></div>
          <ul className={styles.menu}>
            <li className={styles.active}>
              <a href="./Dashboard">
                <CgMenuLeftAlt style={{ fontSize: '1.2rem' }} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Profile">
                <CgProfile style={{ fontSize: '1.1rem' }} />
                <span>Profile</span>
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
              <span>Dashboard</span>
              <h2>Productivity Tracker</h2>
            </div>
            <div className={styles.timerButtonWrapper}>
              <button
                className={`${styles.timerButton} ${isTimerRunning ? styles.endShiftButton : ''}`}
                onClick={toggleTimer}
              >
                {isTimerRunning ? 'End Shift' : 'Start Shift'}
              </button>
              <div className={styles.timerDisplay}>{formatTime(time)}</div>
            </div>
            <div className={styles.userinfo}>
              <div className={styles.searchbox}>
                <FaSearch />
                <input type="text" placeholder="Search" />
              </div>
            </div>
          </div>

          <div className={styles.TaskBox1}>
            <p className={isTaskActive ? styles.inProgressStatus : styles.activeStatus}>
              {isTaskActive ? 'In Progress...' : 'Active'}
            </p>
            <h4><br></br>This is the Task</h4>
            <p>Task description here.
              Task description here.Task description here.Task description here.Task description here.Task description here.
            </p>
            <button className={styles.taskButton} onClick={handleTaskStart}>
              {isTaskActive ? 'Done task' : 'Start task'}
            </button>
          </div>
        </div>
      </body>
    </div>
  );
}

export default Dashboard;
