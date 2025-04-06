// "use client";
// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import crypto from "crypto";
// //import styles from "../../styles/SelectedQuestions.module.css";

// // Smart Contract Details (Replace with actual values)
// const CONTRACT_ADDRESS = "0xBD88298440dc0b049cD35111EEa8F82AC467a5E1";
// const CONTRACT_ABI = [
//     {
//         "inputs": [{ "internalType": "uint256", "name": "count", "type": "uint256" }],
//         "name": "selectRandomQuestions",
//         "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
//         "stateMutability": "view",
//         "type": "function"
//     }
// ];

// // Encryption Constants (Ensure this matches your encryption method)
// const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters
// const IV_LENGTH = 16;

// // Decrypt Function
// const decrypt = (encryptedText) => {
//     try {
//         const [iv, encrypted] = encryptedText.split(":");
//         const decipher = crypto.createDecipheriv(
//             "aes-256-cbc",
//             Buffer.from(ENCRYPTION_KEY),
//             Buffer.from(iv, "hex")
//         );
//         let decrypted = decipher.update(Buffer.from(encrypted, "hex"));
//         decrypted = Buffer.concat([decrypted, decipher.final()]);
//         return decrypted.toString();
//     } catch (error) {
//         console.error("Decryption error:", error);
//         return "Decryption Failed";
//     }
// };

// export default function SelectedQuestions() {
//     const [selectedQuestions, setSelectedQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSelectedQuestions = async () => {
//             try {
//                 if (!window.ethereum) {
//                     setError("MetaMask is required to fetch questions.");
//                     setLoading(false);
//                     return;
//                 }

//                 // Connect to Ethereum provider
//                 const provider = new ethers.BrowserProvider(window.ethereum);
//                 const signer = await provider.getSigner();
//                 const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

//                 // Call Smart Contract function to get selected questions (e.g., 5 questions)
//                 const encryptedQuestionIds = await contract.selectRandomQuestions(5);
//                 console.log("Encrypted Question IDs:", encryptedQuestionIds);

//                 // Decrypt Question IDs
//                 const decryptedQuestions = encryptedQuestionIds.map((id) => decrypt(id));
//                 setSelectedQuestions(decryptedQuestions);
//             } catch (error) {
//                 console.error("Error fetching selected questions:", error);
//                 setError("Failed to load questions.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSelectedQuestions();
//     }, []);

//     return (
//         <div className={styles.container}>
//             <h2 className={styles.heading}>Selected Questions</h2>
//             {loading ? (
//                 <p>Loading questions...</p>
//             ) : error ? (
//                 <p className={styles.error}>{error}</p>
//             ) : (
//                 <ul className={styles.questionList}>
//                     {selectedQuestions.map((question, index) => (
//                         <li key={index} className={styles.questionItem}>
//                             {question}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }

