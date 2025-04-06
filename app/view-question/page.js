// "use client";
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { createHelia } from "helia";
// import { json } from "@helia/json";
// import crypto from "crypto";
// //import styles from "../../styles/ViewQuestion.module.css";

// const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef";
// const IV_LENGTH = 16;

// const decrypt = (encryptedText) => {
//     const [iv, encrypted] = encryptedText.split(":");
//     const decipher = crypto.createDecipheriv(
//         "aes-256-cbc",
//         Buffer.from(ENCRYPTION_KEY),
//         Buffer.from(iv, "hex")
//     );
//     let decrypted = decipher.update(Buffer.from(encrypted, "hex"));
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// };

// export default function ViewQuestion() {
//     const searchParams = useSearchParams();
//     const encryptedId = searchParams.get("encryptedId");
//     const [questionData, setQuestionData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQuestionData = async () => {
//             if (!encryptedId) {
//                 setError("No encrypted ID provided.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const decryptedCID = decrypt(encryptedId);
//                 console.log("Decrypted CID:", decryptedCID);

//                 const helia = await createHelia();
//                 const j = json(helia);
//                 const data = await j.get(decryptedCID);

//                 if (data) {
//                     setQuestionData(data);
//                 } else {
//                     setError("Failed to fetch question data.");
//                 }
//             } catch (err) {
//                 setError("Error retrieving question data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchQuestionData();
//     }, [encryptedId]);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p className={styles.error}>{error}</p>;

//     return (
//         <div className={styles.container}>
//             <h2 className={styles.heading}>Question Details</h2>
//             {questionData && (
//                 <div className={styles.questionCard}>
//                     <p><strong>Chapter:</strong> {questionData.chapterName}</p>
//                     <p><strong>Question:</strong> {questionData.questionDescription}</p>
//                     <ul>
//                         {questionData.choices.map((choice, index) => (
//                             <li key={index}>{choice}</li>
//                         ))}
//                     </ul>
//                     <p><strong>Correct Answer:</strong> {questionData.correctAnswer}</p>
//                 </div>
//             )}
//         </div>
//     );
// }
