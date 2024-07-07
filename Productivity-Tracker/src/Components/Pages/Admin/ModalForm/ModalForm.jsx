import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./ModalForm.module.css"; // Import the CSS module

const ModalForm = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthday: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onRequestClose}
        >
          Close
        </button>
      </form>
    </Modal>
  );
};

export default ModalForm;
