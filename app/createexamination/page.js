// 'use client';

// import { useEffect, useState } from 'react';
// import styles from '../../styles/CreateExamination.module.css';
// import axios from 'axios';
// import { useRouter } from "next/navigation";

// export default function Page() {
//     const [adminData, setAdminData] = useState({
//         name: "",
//         email: "",
//     });
//     const router = useRouter();

//     useEffect(() => {
//         const fetchAdminData = async () => {
//             const adminId = localStorage.getItem("adminId"); 
//             console.log(adminId)
//             if (!adminId) {
//                 alert("Admin not logged in");
//                 router.push("/login");
//                 return;
//             }

//             try {
//                 const response = await axios.get(`/api/admin/${adminId}`);

//                 if (response.status === 200 && response.data) {
//                     setAdminData({
//                         email: response.data.admin.email,
//                         name: response.data.admin.name
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching admin data:", error);
//             }
//         };

//         fetchAdminData();
//     }, [router]);

//     const handleCreateExamination = () => {
//         // const adminId = response.data.id; // Get the ID from the response
//         // localStorage.setItem("adminId", adminId);
//         // console.log(localStorage.getItem("adminId"));

//         router.push("/examregistration");
//         alert('Examination Creation Started!');
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.leftPanel}>
//                 <h2>How to create an Examination in 'VAULT'</h2>
//                 <button className={styles.createButton} onClick={handleCreateExamination}>
//                     Create Examination
//                 </button>
//             </div>
//             <div className={styles.rightPanel}>
//                 <div className={styles.adminHeader}>Admin Account</div>
//                 <p className={styles.name}>Name: <span className={styles.info}>{adminData.name}</span></p>
//                 <p className={styles.name}>Email: <span className={styles.info}>{adminData.email}</span></p>
//             </div>
//         </div>
//     );
// }




// "use client";

// import { useEffect, useState } from 'react';
// import styles from '../../styles/CreateExamination.module.css';
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from 'axios';

// export default function Page() {
//     const [adminData, setAdminData] = useState({ name: "", email: "" });
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     // Get exam details from query parameters
//     const examName = searchParams.get("examName") || "N/A";
//     const examDateTime = searchParams.get("examDateTime") || "N/A";

//     useEffect(() => {
//         const fetchAdminData = async () => {
//             const adminId = localStorage.getItem("adminId");

//             if (!adminId) {
//                 alert("Admin not logged in");
//                 router.push("/login");
//                 return;
//             }

//             try {
//                 // Fetch admin details
//                 const response = await axios.get(`/api/admin/${adminId}`);

//                 if (response.status === 200 && response.data) {
//                     setAdminData({
//                         email: response.data.admin.email,
//                         name: response.data.admin.name
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching admin data:", error);
//             }
//         };

//         fetchAdminData();
//     }, [router]);

//     const handleCreateExamination = () => {
//         router.push("/examregistration");
//         alert('Examination Creation Started!');
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.leftPanel}>
//                 <h2 className={styles.heading}>How to create an Examination in 'VAULT'</h2>
//                 <button className={styles.createButton} onClick={handleCreateExamination}>
//                     Create Examination
//                 </button>
//             </div>
//             <div className={styles.rightPanel}>
//                 <div className={styles.adminHeader} style={{ color: "black" }}>Admin Account</div>
//                 <p className={styles.adminText} style={{ color: "black" }}><strong>Name :</strong> {adminData.name}</p>
//                 <p className={styles.adminText} style={{ color: "black" }}><strong>Email :</strong> {adminData.email}</p>

//                 <div className={styles.examSection}>
//                     <h3 className={styles.examTitle} style={{ color: "black" }}>Exam Details:</h3>
//                     <p className={styles.examText} style={{ color: "black" }}><strong>Exam Name:</strong> {examName}</p>
//                     <p className={styles.examText} style={{ color: "black" }}><strong>Exam Time and Date:</strong> {examDateTime}</p>
//                 </div>
//             </div>
//         </div>
//     );
// }



"use client";

import { useEffect, useState } from 'react';
import styles from '../../styles/CreateExamination.module.css';
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function Page() {
    const [adminData, setAdminData] = useState({ name: "", email: "" });
    const [examName, setExamName] = useState("N/A");
    const [examDateTime, setExamDateTime] = useState("N/A");
    const [description, setDescription] = useState("N/A");
    const router = useRouter();

    useEffect(() => {
        const fetchAdminData = async () => {
            const adminId = localStorage.getItem("adminId");

            if (!adminId) {
                alert("Admin not logged in");
                router.push("/login");
                return;
            }

            try {
                const response = await axios.get(`/api/admin/${adminId}`);

                if (response.status === 200 && response.data) {
                    setAdminData({
                        email: response.data.admin.email,
                        name: response.data.admin.name
                    });
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        
        fetchAdminData();

       
        const storedExamName = localStorage.getItem("examName");
        const storedExamDateTime = localStorage.getItem("examDateTime");
        const storedDescription = localStorage.getItem("description");

        if (storedExamName) setExamName(storedExamName);
        if (storedExamDateTime) setExamDateTime(storedExamDateTime);
        if (storedDescription) setDescription(storedDescription);

    }, [router]);

    const handleCreateExamination = () => {
        router.push("/examregistration");
        alert('Examination Creation Started!');
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h2 className={styles.heading}>How to create an Examination in 'VAULT'</h2>
                <button className={styles.createButton} onClick={handleCreateExamination}>
                    Create Examination
                </button>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.adminHeader}>Admin Account</div>
                <p className={styles.adminText}><strong>Name :</strong> {adminData.name}</p>
                <p className={styles.adminText}><strong>Email :</strong> {adminData.email}</p>

                <div className={styles.examSection}>
                    <h3 className={styles.examTitle}>Exam Details:</h3>
                    <p className={styles.examText}><strong>Exam Name:</strong> {examName}</p>
                    <p className={styles.examText}><strong>Exam Time and Date:</strong> {examDateTime}</p>
                    <p className={styles.examText}><strong>Description:</strong> {description}</p>
                </div>
            </div>
        </div>
    );
}
