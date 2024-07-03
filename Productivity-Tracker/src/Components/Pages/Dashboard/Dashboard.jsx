import React from 'react';
import './Dashboard.css';
import { FaTachometerAlt, FaUser, FaChartBar, FaBriefcase, FaQuestionCircle, FaCog, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { BiAlarm } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { CgMenuGridR } from "react-icons/cg";
import { GoQuestion } from "react-icons/go";
import { VscSettingsGear } from "react-icons/vsc";

function Dashboard() {
  return (
    <div>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dashboard</title>
        <link rel="stylesheet" href="dashboard.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <div className="sidebar">
          <div className="logo"></div>
          <ul className="menu">
            <li className="active">
              <a href="#">
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
              <a href="#">
                <BiAlarm />
                <span>Break</span>
              </a>
            </li>
            <li>
              <a href="#">
                <CgMenuGridR />
                <span>Tasks</span>
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
            <li className="logout">
              <a href="/">

                <BiLogOut />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="main--content">
          <div className="header--wrapper">
            <div className="header--title">
              <span>Primary</span>
              <h2>Dashboard</h2>
            </div>
            <div className="user--info">
              <div className="search--box">
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
