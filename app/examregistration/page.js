"use client";
import axios from 'axios';
import styles from "../../styles/ExamRegistration.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExamRegistration() {
    const [examName, setExamName] = useState("");
    const [examDateTime, setExamDateTime] = useState("");
    const [guidelines, setGuidelines] = useState("");
    const router = useRouter();

    // console.log(adminId);
    // console.log("hello")

    // if (!adminId) {
    //     alert("Admin ID not found. Please log in.");
    //     return;
    // }

   const handleSubmit = async (e) => {
    e.preventDefault();
    const adminId = localStorage.getItem("adminId");
    console.log({ examName, examDateTime, guidelines });

    try {
        // Send POST request to register the exam
        const response = await axios.post('/api/examregistration', {
            examName,
            examDateTime,
            guidelines,
            adminId,
        });

        // Log the entire response for debugging purposes
        console.log("Response from server:", response);
        if (response.status === 201) {
            const examId = response.data.id;
            localStorage.setItem("examId", examId); // Store examId in localStorage
            console.log("Exam ID stored in localStorage:", examId);

            // Navigate to the next page only after successful storage
            router.push("/enterchapters");
        }
    } catch (error) {
        // Log detailed error information
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
                    placeholder="Guidelines:"
                    value={guidelines}
                    onChange={(e) => setGuidelines(e.target.value)}
                    className={styles.textArea}
                />
            </div>
            <button type="submit" className={styles.submitButton}>
                Submit
            </button>
        </form>
    </div>
);

}
