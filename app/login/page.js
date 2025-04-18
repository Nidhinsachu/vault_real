"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../../styles/auth.css"; // Import CSS file

export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/login", user);
            if (res.status === 200) {
                // ✅ Store the token, userId, and role in localStorage
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.userId);
                localStorage.setItem("role", res.data.role);

                alert("Login successful!");
                router.push(`/dashboard/${res.data.role}`);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed!");
        }
    };

    
    return (
        <div className="container">
            <div className="form-box">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
}
