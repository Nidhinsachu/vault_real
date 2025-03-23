"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/DisplayEncryptedIds.module.css";

export default function DisplayEncryptedIds() {
    const [encryptedIds, setEncryptedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEncryptedIds = async () => {
            try {
                const response = await axios.get("/api/getEncryptedIds");
                console.log("API Response:", response.data); // Debugging log
                
                // Ensure response data is an array
                if (Array.isArray(response.data)) {
                    setEncryptedIds(response.data);
                } else {
                    setError("Invalid data format received.");
                }
            } catch (err) {
                setError("Failed to fetch encrypted IDs.");
            } finally {
                setLoading(false);
            }
        };

        fetchEncryptedIds();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Encrypted Question IDs</h2>
            <ul className={styles.list}>
                {encryptedIds.length > 0 ? (
                    encryptedIds.map((item, index) => (
                        <li key={index} className={styles.listItem}>
                            {typeof item === "object" && item !== null ? JSON.stringify(item) : item}
                        </li>
                    ))
                ) : (
                    <p>No encrypted IDs available.</p>
                )}
            </ul>
        </div>
    );
}