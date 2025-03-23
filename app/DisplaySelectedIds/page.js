"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { createHelia } from "helia";
import { json } from "@helia/json";
import crypto from "crypto";
import styles from "../../styles/DisplaySelectedIds.module.css";

const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters
const IV_LENGTH = 16; // AES block size

const decrypt = (encryptedText) => {
    try {
        const [iv, encrypted] = encryptedText.split(":");
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(ENCRYPTION_KEY),
            Buffer.from(iv, "hex")
        );
        let decrypted = decipher.update(Buffer.from(encrypted, "hex"));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

export default function DisplaySelectedIds() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const idsString = urlParams.get("ids");
                if (!idsString) throw new Error("No IDs found");

                const encryptedIds = JSON.parse(decodeURIComponent(idsString));
                console.log("Encrypted IDs:", encryptedIds);

                const decryptedIds = encryptedIds.map((id) => decrypt(id)).filter(Boolean);
                console.log("Decrypted IPFS CIDs:", decryptedIds);

                const retrievedQuestions = await fetchFromIPFS(decryptedIds);
                setQuestions(retrievedQuestions);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const fetchFromIPFS = async (ipfsCIDs) => {
        try {
            const helia = await createHelia();
            const j = json(helia);

            const questionPromises = ipfsCIDs.map(async (cid) => {
                try {
                    const data = await j.get(cid);
                    return data;
                } catch (error) {
                    console.error(`Error fetching from IPFS (CID: ${cid}):`, error);
                    return null;
                }
            });

            return (await Promise.all(questionPromises)).filter(Boolean);
        } catch (error) {
            console.error("Error retrieving data from IPFS:", error);
            return [];
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Selected Questions</h2>
            {loading ? (
                <p>Loading questions...</p>
            ) : questions.length === 0 ? (
                <p>No questions found.</p>
            ) : (
                <ul className={styles.questionList}>
                    {questions.map((question, index) => (
                        <li key={index} className={styles.questionItem}>
                            <h3>Chapter: {question.chapterName}</h3>
                            <p><strong>Question:</strong> {question.questionDescription}</p>
                            <p><strong>Choices:</strong></p>
                            <ul>
                                {question.choices.map((choice, i) => (
                                    <li key={i}>{choice}</li>
                                ))}
                            </ul>
                            <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                            <p><strong>Weightage:</strong> {question.weightage.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
