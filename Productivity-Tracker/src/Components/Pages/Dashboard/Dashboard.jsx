import React, { useState } from 'react'
import './Dashboard.css'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import { GrDashboard } from "react-icons/gr"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



function Dashboard() {
  return (
    <div className="sidebar">
      <div className="logo">
        <ul className='main'>
          <li>
            <a href="#">
              <i className='fas fa-tachometer-alt'><GrDashboard /></i>
              <span>Dashboard</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard