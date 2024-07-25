import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";

function UserProfileEdit() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    role: "",
    status: "",
    contactNumber: "",
    profilePicture: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData({
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          gender: response.data.gender,
          role: response.data.role,
          status: response.data.status,
          contactNumber: response.data.contactNumber,
          profilePicture: response.data.profilePicture,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/"); // Redirect to login if an error occurs
      }
    };

    fetchUserData();
  }, [navigate]);

  const password_validate = (password) => {
    var re = {
      capital: /(?=.*[A-Z])/,
      length: /(?=.{7,40}$)/,
      specialChar: /[ -\/:-@\[-\`{-~]/,
      digit: /(?=.*[0-9])/,
    };
    return (
      re.capital.test(password) &&
      re.length.test(password) &&
      re.specialChar.test(password) &&
      re.digit.test(password)
    );
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else if (userData.password && !password_validate(userData.password)) {
      setPasswordError(
        "Password must contain at least 1 capital letter, 1 special character, 1 digit, and be between 7-40 characters long"
      );
    } else {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          "http://localhost:5000/auth/update",
          { ...userData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Profile updated successfully");
        setIsEditMode(false); // Exit edit mode after successful update
      } catch (error) {
        console.error("Error updating profile:", error);
        alert(
          "An error occurred while updating the profile. Please try again."
        );
      }
    }
  };

  return (
    <div className={styles.userProfileEdit}>
      <div className="container-xl px-4 mt-4">
        <div className="row">
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Profile Picture</div>
              <div className="card-body text-center">
                <img
                  className="img-account-profile rounded-circle mb-2"
                  src={
                    userData.profilePicture || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                />
                <div className="small font-italic text-muted mb-4"></div>
                <button className="btn btn-primary" type="button">
                  Upload new image
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header">Account Details</div>
              <div className="card-body">
                {isEditMode ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputUsername">
                        Username
                      </label>
                      <input
                        className="form-control"
                        id="inputUsername"
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputEmail">
                        Email address
                      </label>
                      <input
                        className="form-control"
                        id="inputEmail"
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputFirstName">
                        First name
                      </label>
                      <input
                        className="form-control"
                        id="inputFirstName"
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputLastName">
                        Last name
                      </label>
                      <input
                        className="form-control"
                        id="inputLastName"
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputGender">
                        Gender
                      </label>
                      <select
                        className="form-control"
                        id="inputGender"
                        name="gender"
                        value={userData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputRole">
                        Role
                      </label>
                      <input
                        className="form-control"
                        id="inputRole"
                        type="text"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        placeholder="Role"
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputStatus">
                        Status
                      </label>
                      <select
                        className="form-control"
                        id="inputStatus"
                        name="status"
                        value={userData.status}
                        onChange={handleChange}
                      >
                        <option value="Unavailable">Unavailable</option>
                        <option value="Production">Production</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Coaching">Coaching</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Break">Break</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label
                        className="small mb-1"
                        htmlFor="inputContactNumber"
                      >
                        Contact Number
                      </label>
                      <input
                        className="form-control"
                        id="inputContactNumber"
                        type="tel"
                        name="contactNumber"
                        value={userData.contactNumber}
                        onChange={handleChange}
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputPassword">
                        Password
                      </label>
                      <input
                        className="form-control"
                        id="inputPassword"
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputConfirm">
                        Confirm Password
                      </label>
                      <input
                        className="form-control"
                        id="inputConfirm"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {passwordError && (
                        <div className="text-danger">{passwordError}</div>
                      )}
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Save changes
                    </button>
                  </form>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label className="small mb-1">Username</label>
                      <p>{userData.username}</p>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1">Email address</label>
                      <p>{userData.email}</p>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1">First name</label>
                      <p>{userData.firstName}</p>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1">Last name</label>
                      <p>{userData.lastName}</p>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1">Gender</label>
                      <p>{userData.gender}</p>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1">Role</label>
                      <p>{userData.role}</p>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1">Status</label>
                      <p>{userData.status}</p>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1">Contact Number</label>
                      <p>{userData.contactNumber}</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsEditMode(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileEdit;
