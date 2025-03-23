"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/QuestionBank.module.css";
import { useRouter } from "next/navigation";

const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters

// Convert text to Uint8Array
const textToUint8Array = (text) => new TextEncoder().encode(text);

// Convert Uint8Array to text
const uint8ArrayToText = (array) => new TextDecoder().decode(array);

// Convert base64 to Uint8Array
const base64ToUint8Array = (base64) => {
    const binaryString = atob(base64);
    return new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
};

// Convert Uint8Array to base64
const uint8ArrayToBase64 = (array) => {
    const binaryString = String.fromCharCode(...array);
    return btoa(binaryString);
};

// Generate encryption key
const getKey = async () => {
    return crypto.subtle.importKey(
        "raw",
        textToUint8Array(ENCRYPTION_KEY),
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
    );
};

// Encrypt function
const encrypt = async (text) => {
    if (!text) return null;
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        key,
        textToUint8Array(text)
    );
    return uint8ArrayToBase64(iv) + ":" + uint8ArrayToBase64(new Uint8Array(encrypted));
};

// Decrypt function
const decrypt = async (encryptedText) => {
    if (!encryptedText) return null;
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
};

export default function QuestionBankForm() {
    const router = useRouter();
    const [chapterName, setChapterName] = useState("");
    const [questionDescription, setQuestionDescription] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [weightage, setWeightage] = useState([]);
    const [chapters, setChapters] = useState([]);

    const adminId = typeof window !== "undefined" ? localStorage.getItem("adminId") : null;

    useEffect(() => {
        const fetchChapters = async () => {
            if (!adminId) return;

            try {
                const response = await fetch(`/api/enterchapters?adminId=${adminId}`);
                if (response.ok) {
                    const data = await response.json();
                    setChapters(data);
                } else {
                    console.error("Failed to fetch chapters.");
                }
            } catch (error) {
                console.error("Error fetching chapters:", error);
            }
        };

        fetchChapters();
    }, [adminId]);

    const handleChoiceChange = (index, value) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handleWeightageChange = (value) => {
        setWeightage((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { chapterName, questionDescription, choices, correctAnswer, weightage };

        try {
            const ipfsUrl = await storeDataOnIPFS(formData);
            if (ipfsUrl) {
                alert(`Question submitted! IPFS URL: ${ipfsUrl}`);
            }
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    const handleFinish = () => {
        router.push("/random");
    };

    const handleNewPage = () => {
        router.push("/newpage");
    };

    const storeDataOnIPFS = async (formData) => {
        try {
            const jsonData = JSON.stringify(formData);
            const blob = new Blob([jsonData], { type: "application/json" });

            const fileData = new FormData();
            fileData.append("file", blob, "questionData.json");

            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fileData, {
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
                    "Content-Type": "multipart/form-data",
                },
            });

            const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log("Stored File URL:", fileUrl);
            console.log(response.data.IpfsHash);
            
            const encryptedAddress = await encrypt(response.data.IpfsHash);
            console.log("Encrypted Address:", encryptedAddress);
            
            
            const decryptedAddress = await decrypt(encryptedAddress);
            console.log("Decrypted Address:", decryptedAddress);

            const id = localStorage.getItem("examId");
            await axios.post("/api/questionbank", { encryptedAddress, id });
            console.log("Data saved to backend");

            return fileUrl;
        } catch (error) {
            console.error("Error storing data on IPFS:", error.message || error);
            return null;
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Question Bank</h2>
            <form onSubmit={handleSubmit}>
                <label className={styles.formLabel}>
                    Pick Chapter Name:
                    <select
                        value={chapterName}
                        onChange={(e) => setChapterName(e.target.value)}
                        className={styles.inputField}
                    >
                        <option value="">Select Chapter</option>
                        {chapters.length > 0 ? (
                            chapters.map((chapter) => (
                                <option key={chapter._id} value={chapter.chapterName}>
                                    {chapter.chapterName}
                                </option>
                            ))
                        ) : (
                            <option>No chapters available</option>
                        )}
                    </select>
                </label>

                <label className={styles.formLabel}>
                    Enter Question Description:
                    <textarea
                        value={questionDescription}
                        onChange={(e) => setQuestionDescription(e.target.value)}
                        className={styles.inputField}
                        rows={4}
                    />
                </label>

                <label className={styles.formLabel}>
                    Enter Multiple Choices:
                    <div className={styles.choices}>
                        {choices.map((choice, index) => (
                            <input
                                key={index}
                                type="text"
                                value={choice}
                                onChange={(e) => handleChoiceChange(index, e.target.value)}
                                className={styles.choiceInput}
                            />
                        ))}
                    </div>
                </label>
                

                <label className={styles.formLabel}>
                    Pick The Correct Answer:
                    <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className={styles.inputField}
                    />
                </label>

                <button type="submit" className={styles.submitButton}>
                    Submit
                </button>
                <button type="button" className={styles.finishButton} onClick={handleFinish}>
                    Finish
                </button>
                <button type="button" className={styles.newPageButton} onClick={handleNewPage}>
                    Go to New Page
                </button>
            </form>

        </div>
    );
}



