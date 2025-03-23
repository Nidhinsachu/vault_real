"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/DisplayQuestionIds.module.css";

export default function DisplayQuestionIds() {
    const [questionIds, setQuestionIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [examId, setExamId] = useState(null);

    useEffect(() => {
        // Ensure localStorage is accessed only in the client
        if (typeof window !== "undefined") {
            setExamId(localStorage.getItem("examId"));
        }
    }, []);

    useEffect(() => {
        const fetchQuestionIds = async () => {
            if (!examId) {
                setError("Exam ID is missing");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching question IDs with examId:", examId);
                const response = await axios.get(`/api/questionbank?examId=${examId}`);
                
                if (response.status === 200) {
                    setQuestionIds(response.data.questionIds);
                } else {
                    setError("Failed to fetch question IDs.");
                }
            } catch (error) {
                console.error("Error fetching question IDs:", error);
                setError("An error occurred while fetching question IDs.");
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            fetchQuestionIds();
        }
    }, [examId]);

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Stored Question IDs</h2>

            {loading ? (
                <p className={styles.loading}>Loading...</p>
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : questionIds.length > 0 ? (
                <ul className={styles.list}>
                    {questionIds.map((id, index) => (
                        <li key={index} className={styles.listItem}>{id}</li>
                    ))}
                </ul>
            ) : (
                <p className={styles.loading}>No Question IDs found.</p>
            )}
        </div>
    );
}
