'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/CreateExamination.module.css';
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function Page() {
    const [studentData, setAdminData] = useState({
        name: "",
        email: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [passKey, setPassKey] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchAdminData = async () => {
            const studentId = localStorage.getItem("studentId");
            console.log(studentId)
            if (!studentId) {
                alert("student not logged in");
                router.push("/login");
                return;
            }

            try {
                const response = await axios.get(`/api/student/${studentId}`);

                if (response.status === 200 && response.data) {
                    setAdminData({
                        email: response.data.student.email,
                        name: response.data.student.name
                    });
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchAdminData();
    }, [router]);


    const handleCreateExamination = () => {
        setIsModalOpen(true);
    };

    const handleSubmitPassKey = async () => {
        try {
            if (!passKey) {
                return;
            }


            const response = await axios.get(`/api/examregistration?passkey=${encodeURIComponent(passKey)}`);

            if (response.status === 200) {
                router.push("/newpage");
            } else {
                setError("Invalid pass key. Please try again.");
            }
        } catch (err) {
            setError("Error validating pass key.");
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h2>How to attend an Examination in 'VAULT'</h2>
                <button className={styles.createButton} onClick={handleCreateExamination}>
                    Start Examination
                </button>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.adminHeader}>Student Account</div>
                <p className={styles.name}>Name: <span className={styles.info}>{studentData.name}</span></p>
                <p className={styles.name}>Email: <span className={styles.info}>{studentData.email}</span></p>
            </div>
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Enter Pass Key</h3>
                        <input
                            type="text"
                            placeholder="Enter Pass Key"
                            value={passKey}
                            onChange={(e) => setPassKey(e.target.value)}
                            className={styles.inputField}
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button className={styles.submitButton} onClick={handleSubmitPassKey}>
                            Submit
                        </button>
                        <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
