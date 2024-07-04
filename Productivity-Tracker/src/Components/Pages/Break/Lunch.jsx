import React from 'react';
import './Lunch.css';
import { FaTachometerAlt, FaUser, FaChartBar, FaBriefcase, FaQuestionCircle, FaCog, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { BiAlarm } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { CgMenuGridR } from "react-icons/cg";
import { GoQuestion } from "react-icons/go";
import { VscSettingsGear } from "react-icons/vsc";

function Lunch() {
  return (
    <div>
      <body>
        <div className="sidebar">
          <div className="logo"></div>
          <ul className="menu">
            <li>
              <a href="./Dashboard">
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
            <li className="active">
              <a href="./Lunch">
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
              <a href="#">

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
              <h2>Lunch</h2>
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

export default Lunch;
