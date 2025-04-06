"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../../styles/auth.css"

export default function Register() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });

    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/register", user);
            if (res.status === 201) {
                alert("Registration successful!");
                router.push("/login");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed!");
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Full Name" value={user.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required />
                    <select name="role" value={user.role} onChange={handleChange}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
}
