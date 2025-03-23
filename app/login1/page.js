"use client";
import axios from 'axios';
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from '../../styles/AdminRegistration.module.css';

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(password,email)

        try {
            const response = await axios.post('/api/student/login1', { password, email });

            if (response.status === 200) {
                const studentId = response.data.student.studentId;
                localStorage.setItem("studentId", studentId);
                console.log(localStorage.getItem("studentId"));
              
                router.push("/attendexam");
                console.log("Logged in.");
            } else {
                console.error("Unexpected response status:", response.status);
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.log("Login error:", error);
            alert("An error occurred while logging in. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit" className={styles.submitButton}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
