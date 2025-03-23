
"use client";
import axios from 'axios';
import styles from "../../styles/ExamRegistration.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExamRegistration() {
    const [examName, setExamName] = useState("");
    const [examDateTime, setExamDateTime] = useState("");
    const [description, setDescription] = useState("");
    const [passKey, setPassKey] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const adminId = localStorage.getItem("adminId");

        console.log({ examName, examDateTime, description });

        try {

            const response = await axios.post('/api/examregistration', {
                examName,
                examDateTime,
                description,
                adminId,
                passKey,
            });

            console.log("Response from server:", response);
            if (response.status === 201) {
                const examId = response.data.id;


                localStorage.setItem("examId", examId);
                localStorage.setItem("examName", examName);
                localStorage.setItem("examDateTime", examDateTime);
                localStorage.setItem("description", description);

                console.log("Exam details stored in localStorage.");

                // Navigate to the next page after successful storage
                router.push("/enterchapters");
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response from server:", error.response.data);
            } else if (error.request) {
                console.error("No response received from server:", error.request);
            } else {
                console.error("Unexpected error during exam registration:", error.message);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Exam Registration</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Exam Name"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        className={styles.inputField}
                        required
                    />
                    <span className={styles.requiredIndicator}>*</span>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="datetime-local"
                        placeholder="Exam Date And Time"
                        value={examDateTime}
                        onChange={(e) => setExamDateTime(e.target.value)}
                        className={styles.inputField}
                        required
                    />
                    <span className={styles.requiredIndicator}>*</span>
                </div>
                <div className={styles.inputGroup}>
                    <textarea
                        placeholder="Exam Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.textArea}
                        required
                    />
                    <span className={styles.requiredIndicator}>*</span>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Enter Passkey"
                        value={passKey}
                        onChange={(e) => setPassKey(e.target.value)}
                        className={styles.inputField}
                        required
                    />
                    <span className={styles.requiredIndicator}>*</span>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Submit
                </button>
            </form>
        </div>
    );
}
