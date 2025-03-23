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
        console.log(name, password, confirmpassword, email);
        try {
            const response = await axios.post('/api/student/register', { name, password, confirmpassword, email });
            console.log(response);
            if (response.status === 201) {
                const studentId = response.data.id; 
                localStorage.setItem("studentId", studentId);
                console.log(localStorage.getItem("studentId"));
                router.push("/login1");
              } else {
                alert("Student Registration failed");
              }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2>Student Registration</h2>
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
