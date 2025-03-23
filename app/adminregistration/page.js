"use client";
import axios from 'axios';
import styles from '../../styles/AdminRegistration.module.css';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/register', { name, password, confirmpassword, email });
      if (response.status === 201) {
        const adminId = response.data.id; 
        localStorage.setItem("adminId", adminId);
        console.log(localStorage.getItem("adminId"));
        router.push("/login");
      } else {
        alert("Admin Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2>Administrator Registration</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
            className={styles.inputField}
            required
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
      </div>
     
     
    </div>
  );
}
