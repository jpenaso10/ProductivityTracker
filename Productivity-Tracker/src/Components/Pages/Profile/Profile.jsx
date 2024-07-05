import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState({});
  const [bills, setBills] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/auth/user')
      .then(response => {
        setUser(response.data.user);
        setBills(response.data.bills);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSMSActivation = () => {
    // Handle SMS activation logic here
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.profilePicture || '/default-avatar.png'} alt="Profile" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <button onClick={handleSMSActivation}>
          {user.smsActivated ? 'Deactivate SMS Alerts' : 'Activate SMS Alerts'}
        </button>
      </div>
      <div className="profile-details">
        <div className="account-info">
          <h3>My xPay Accounts</h3>
          <div>
            <p>Active account: {user.activeAccount}</p>
            <p>Blocked account: {user.blockedAccount}</p>
          </div>
          <button>Edit</button>
        </div>
        <div className="bill-info">
          <h3>My Bills</h3>
          <ul>
            {bills.map(bill => (
              <li key={bill.id} className={bill.paid ? 'paid' : 'unpaid'}>
                {bill.name} - {bill.paid ? 'Paid' : 'Not Paid'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;
