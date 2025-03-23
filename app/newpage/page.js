// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import styles from "../../styles/Answer.css"; // Import styles
// import { ethers, BrowserProvider } from "ethers";


// const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters

// const textToUint8Array = (text) => new TextEncoder().encode(text);
// const uint8ArrayToText = (array) => new TextDecoder().decode(array);
// const base64ToUint8Array = (base64) => new Uint8Array([...atob(base64)].map(char => char.charCodeAt(0)));
// const uint8ArrayToBase64 = (array) => btoa(String.fromCharCode(...array));


// const getKey = async () => {
//     return crypto.subtle.importKey(
//         "raw",
//         textToUint8Array(ENCRYPTION_KEY),
//         { name: "AES-CBC" },
//         false,
//         ["encrypt", "decrypt"]
//     );
// };

// const decrypt = async (encryptedText) => {
//     if (!encryptedText) return null;
//     try {
//         const [ivBase64, encryptedBase64] = encryptedText.split(":");
//         const key = await getKey();
//         const iv = base64ToUint8Array(ivBase64);
//         const encryptedData = base64ToUint8Array(encryptedBase64);

//         const decrypted = await crypto.subtle.decrypt(
//             { name: "AES-CBC", iv },
//             key,
//             encryptedData
//         );

//         return uint8ArrayToText(new Uint8Array(decrypted));
//     } catch (error) {
//         console.error("Decryption error:", error);
//         return null;
//     }
// };



// const uploadToIPFS = async (data) => {
//     try {
//         const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
//         const fileData = new FormData();
//         fileData.append("file", blob, "questionData.json");

//         const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fileData, {
//             headers: {
//                 pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
//                 pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
//                 "Content-Type": "multipart/form-data",
//             },
//         });

//         return response.data.IpfsHash;
//     } catch (error) {
//         console.error("Error uploading to IPFS:", error);
//         return null;
//     }
// };

// export default function DecryptQuestionBank() {
//     const router = useRouter();
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [attendedCount, setAttendedCount] = useState(0);
//     const [provider, setProvider] = useState(null);
//     const [signer, setSigner] = useState(null);

//     // const CONTRACT_ADDRESS = "0x2634827e63173EabfCee85695041B3cE6D60D973"; // Replace with your contract address
//     // const ABI = [
//     //     {
//     //         inputs: [{ internalType: "string[]", name: "_questions", type: "string[]" }],
//     //         name: "addQuestions",
//     //         outputs: [],
//     //         stateMutability: "nonpayable",
//     //         type: "function",
//     //     },
//     //     {
//     //         inputs: [],
//     //         name: "selectRandomQuestions",
//     //         outputs: [],
//     //         stateMutability: "nonpayable",
//     //         type: "function",
//     //     },
//     //     {
//     //         inputs: [],
//     //         name: "getSelectedQuestions",
//     //         outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
//     //         stateMutability: "view",
//     //         type: "function",
//     //     },
//     //     {
//     //         anonymous: false,
//     //         inputs: [
//     //             { indexed: true, internalType: "address", name: "sender", type: "address" },
//     //             { indexed: false, internalType: "string[]", name: "selectedQuestions", type: "string[]" },
//     //         ],
//     //         name: "QuestionsSelected",
//     //         type: "event",
//     //     },
//     // ];



//     useEffect(() => {
//         const fetchQuestions = async () => {

//             console.log("works ")
//             try {
//                 const response = await axios.get("/api/selectedquestions");

//                 console.log(response.data)

//                 if (response.data && response.data.length > 0) {
//                     const decryptedData = await Promise.all(
//                         response.data.map(async (encryptedId) => {
//                             const decryptedIpfsHash = await decrypt(encryptedId);
//                             if (decryptedIpfsHash) {
//                                 const ipfsResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${decryptedIpfsHash}`);
//                                 return ipfsResponse.data;
//                             }
//                             return null;
//                         })
//                     );
//                     setQuestions(decryptedData.filter(Boolean));

//                 }
//             } catch (error) {
//                 console.error("Error fetching event logs:", error);
//             }
//             // try {
//             //     const response = await axios.get("/api/encryp");

//             //     if (response.data && response.data.length > 0) {
//             //         const decryptedData = await Promise.all(
//             //             response.data.map(async (encryptedId) => {
//             //                 const decryptedIpfsHash = await decrypt(encryptedId);
//             //                 if (decryptedIpfsHash) {
//             //                     const ipfsResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${decryptedIpfsHash}`);
//             //                     return ipfsResponse.data;
//             //                 }
//             //                 return null;
//             //             })
//             //         );
//             //         setQuestions(decryptedData.filter(Boolean));
//             //     }
//             // } catch (error) {
//             //     console.error("Error fetching questions:", error);
//             // }

//         };
//         fetchQuestions();
//     }, [provider]);

//     // const connectWallet = async () => {
//     //     if (!window.ethereum) return alert("MetaMask is not installed!");
//     //     try {
//     //         await window.ethereum.request({
//     //             method: "wallet_switchEthereumChain",
//     //             params: [{ chainId: "0x13882" }],
//     //         }); // Polygon Amoy

//     //         const web3Provider = new BrowserProvider(window.ethereum);
//     //         await window.ethereum.request({ method: "eth_requestAccounts" });

//     //         const signer = await web3Provider.getSigner();
//     //         setProvider(web3Provider);
//     //         setSigner(signer);

//     //         alert("Wallet connected to Polygon Amoy!");
//     //     } catch (error) {
//     //         console.error("Wallet connection failed:", error);
//     //     }
//     // };

//     const handleOptionChange = (index, value) => {
//         if (!answers[index]) {
//             setAttendedCount(prev => prev + 1);
//         }
//         setAnswers((prev) => ({ ...prev, [index]: value }));
//     };

//     const handleSubmit = async (index) => {
//         const selectedAnswer = answers[index];
//         if (!selectedAnswer) {
//             alert("Please select an answer before submitting.");
//             return;
//         }

//         const questionData = {
//             question: questions[index].questionDescription,
//             answer: selectedAnswer
//         };

//         const ipfsHash = await uploadToIPFS(questionData);
//         if (ipfsHash) {
//             console.log("Answer stored on IPFS with hash:", ipfsHash);
//             alert(`Answer stored on IPFS: ${ipfsHash}`);
//         } else {
//             alert("Failed to store answer on IPFS.");
//         }
//     };

//     return (
//         <div className="container">
//             {/* <button onClick={connectWallet}>Connect Wallet</button> */}

//             <div className="question-section">
//                 {questions.length > 0 ? (
//                     questions.map((question, index) => (
//                         <div key={index} className="question-card">
//                             <h3 className="text-black">Question  {index + 1}:</h3>
//                             <p>{question.questionDescription}</p>
//                             {question.choices.map((choice, choiceIndex) => (
//                                 <div key={choiceIndex} className="option">
//                                     <input
//                                         type="checkbox"
//                                         name={`question-${index}`}
//                                         value={choice}
//                                         checked={answers[index] === choice}
//                                         onChange={() => handleOptionChange(index, choice)}
//                                     />
//                                     <label>{choice}</label>
//                                 </div>
//                             ))}
//                             <button className="submit-btn" onClick={() => handleSubmit(index)}>Submit</button>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No questions found.</p>
//                 )}
//             </div>


//             <div className="dashboard">
//                 <button className="timer-btn">Timer</button>
//                 <div className="dashboard-info">
//                     {/* <h3>Dashboard</h3> */}
//                     <p>Total: {questions.length}</p>
//                     <p>Attended: {attendedCount}</p>
//                 </div>
//                 <button className="submit-exam-btn">Submit Exam</button>
//             </div>






//         </div>
//     );
// }




"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../../styles/Answer.css"; // Import styles
import { ethers, BrowserProvider } from "ethers";

const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters

const textToUint8Array = (text) => new TextEncoder().encode(text);
const uint8ArrayToText = (array) => new TextDecoder().decode(array);
const base64ToUint8Array = (base64) =>
    new Uint8Array([...atob(base64)].map((char) => char.charCodeAt(0)));
const uint8ArrayToBase64 = (array) =>
    btoa(String.fromCharCode(...array));

const getKey = async () => {
    return crypto.subtle.importKey(
        "raw",
        textToUint8Array(ENCRYPTION_KEY),
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
    );
};

const decrypt = async (encryptedText) => {
    if (!encryptedText) return null;
    try {
        const [ivBase64, encryptedBase64] = encryptedText.split(":");
        const key = await getKey();
        const iv = base64ToUint8Array(ivBase64);
        const encryptedData = base64ToUint8Array(encryptedBase64);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv },
            key,
            encryptedData
        );

        return uint8ArrayToText(new Uint8Array(decrypted));
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

const uploadToIPFS = async (data) => {
    try {
        const blob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });
        const fileData = new FormData();
        fileData.append("file", blob, "questionData.json");

        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            fileData,
            {
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        return null;
    }
};

export default function DecryptQuestionBank() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [attendedCount, setAttendedCount] = useState(0);
    const [currentTime, setCurrentTime] = useState("Loading...");

   // Fetch questions on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            console.log("Fetching questions...");
            try {
                const response = await axios.get("/api/selectedquestions");
                console.log(response.data);

                if (response.data && response.data.length > 0) {
                    const decryptedData = await Promise.all(
                        response.data.map(async (encryptedId) => {
                            const decryptedIpfsHash = await decrypt(encryptedId);
                            if (decryptedIpfsHash) {
                                const ipfsResponse = await axios.get(
                                    `https://gateway.pinata.cloud/ipfs/${decryptedIpfsHash}`
                                );
                                return ipfsResponse.data;
                            }
                            return null;
                        })
                    );
                    setQuestions(decryptedData.filter(Boolean));
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);


    // Ensure proper dependencies
    

    // Update live clock every second
    useEffect(() => {
        const updateClock = () => {
            setCurrentTime(new Date().toLocaleTimeString());
        };

        updateClock(); // Update immediately
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleOptionChange = (index, value) => {
        if (!answers[index]) {
            setAttendedCount((prev) => prev + 1);
        }
        setAnswers((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async (index) => {
        const selectedAnswer = answers[index];
        if (!selectedAnswer) {
            alert("Please select an answer before submitting.");
            return;
        }

        const questionData = {
            question: questions[index].questionDescription,
            answer: selectedAnswer,
        };

        const ipfsHash = await uploadToIPFS(questionData);
        if (ipfsHash) {
            console.log("Answer stored on IPFS with hash:", ipfsHash);
            alert(`Answer stored on IPFS: ${ipfsHash}`);
        } else {
            alert("Failed to store answer on IPFS.");
        }
    };

    return (
        <div className="container">
            <div className="question-section">
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <div key={index} className="question-card">
                            <h3 className="text-black">Question {index + 1}:</h3>
                            <p>{question.questionDescription}</p>
                            {question.choices.map((choice, choiceIndex) => (
                                <div key={choiceIndex} className="option">
                                    <input
                                        type="checkbox"
                                        name={`question-${index}`}
                                        value={choice}
                                        checked={answers[index] === choice}
                                        onChange={() => handleOptionChange(index, choice)}
                                    />
                                    <label>{choice}</label>
                                </div>
                            ))}
                            <button className="submit-btn" onClick={() => handleSubmit(index)}>
                                Submit
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No questions found.</p>
                )}
            </div>

            <div className="dashboard">
                <button className="timer-btn">{currentTime}</button>
                <div className="dashboard-info">
                    <p>Total: {questions.length}</p>
                    <p>Attended: {attendedCount}</p>
                </div>
                <button className="submit-exam-btn">Submit Exam</button>
            </div>
        </div>
    );
}
