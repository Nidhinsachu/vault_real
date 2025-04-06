"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import styles from "../../../../styles/Answer.css"
import { useRouter } from 'next/navigation';


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
    const { examid } = useParams();
    const [exam, setExam] = useState({});
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [attendedCount, setAttendedCount] = useState(0);
    const [submittedQuestions, setSubmittedQuestions] = useState(new Set()); // Track submitted questions
    const [timeLeft, setTimeLeft] = useState(null); // Remaining time in seconds
    const [score, setScore] = useState(0);
    const router = useRouter();

    // Fetch exam and questions
    useEffect(() => {
        const fetchExamAndQuestions = async () => {
            console.log("Fetching questions and exam details...");
            try {
                // Fetch Questions
                const response = await axios.get(`/api/question?examId=${examid}&attend=true`);
                if (response.data && response.data.length > 0) {
                    const decryptedData = await Promise.all(
                        response.data.map(async (encryptedId) => {
                            try {
                                const decryptedIpfsHash = await decrypt(encryptedId);
                                if (decryptedIpfsHash) {
                                    const ipfsResponse = await axios.get(
                                        `https://gateway.pinata.cloud/ipfs/${decryptedIpfsHash}`
                                    );
                                    return ipfsResponse.data;
                                }
                            } catch (error) {
                                console.error("Error decrypting or fetching from IPFS:", error);
                            }
                            return null;
                        })
                    );

                    console.log(decryptedData)

                    setQuestions(decryptedData.filter(Boolean));
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }

            try {
                // Fetch Exam Details
                const examResponse = await axios.get(`/api/exam/${examid}`);
                if (examResponse.data.exam) {
                    setExam(examResponse.data.exam);

                    // Calculate remaining time
                    const examStartTime = new Date(examResponse.data.exam.examDateTime);
                    const duration = examResponse.data.exam.duration * 60; // Convert minutes to seconds
                    const endTime = examStartTime.getTime() + duration * 1000;
                    const now = new Date().getTime();
                    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

                    setTimeLeft(remaining);

                    if (remaining <= 0) {
                        handleExamSubmit(); // Auto-submit if time is up
                    }
                }
            } catch (error) {
                console.error("Error fetching exam details:", error);
            }
        };

        fetchExamAndQuestions();
    }, [examid]);

    // Countdown Timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleExamSubmit(); // Auto-submit when time reaches 0
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOptionChange = (index, value) => {
        if (submittedQuestions.has(index)) return;

        setAnswers((prev) => ({ ...prev, [index]: value }));
    };

    // Handle Individual Question Submission
    const handleSubmit = async (index) => {
        if (submittedQuestions.has(index)) {
            alert("This question has already been submitted!");
            return;
        }

        const selectedAnswer = answers[index];
        if (!selectedAnswer) {
            alert("Please select an answer before submitting.");
            return;
        }

        if (selectedAnswer == questions[index].correctAnswer) {
            setScore((prev) => prev + 1);
        }

        setSubmittedQuestions((prev) => new Set(prev).add(index));
        setAttendedCount((prev) => prev + 1);

        // const questionData = {
        //     question: questions[index].questionDescription,
        //     answer: selectedAnswer,
        // };

        // const ipfsHash = await uploadToIPFS(questionData);
        // if (ipfsHash) {
        //     console.log("Answer stored on IPFS with hash:", ipfsHash);
        //     alert(`Answer stored on IPFS: ${ipfsHash}`);
        // } else {
        //     alert("Failed to store answer on IPFS.");
        // }
    };

    // Handle Full Exam Submission
    const handleExamSubmit = async () => {
        if (submittedQuestions.length === 0 && !autoSubmit) {
            alert("You must answer at least one question before submitting.");
            return;
        }

        try {
            const studentId = await localStorage.getItem("userId");

            const response = await axios.post(`/api/exam/${examid}`, {
                studentId,
                score
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status == 200) {
                alert(`Exam submitted successfully! Score: ${score}/${questions.length}.`);
                router.push("/dashboard/student");
                
            } else {
                if (response.status === 403) {
                    alert("You have already submitted this exam!");
                    setTimeLeft(0);
                    return;
                }
            }

            setAnswers({});
            setSubmittedQuestions(new Set());
            setAttendedCount(0);
            setTimeLeft(0);
        } catch (error) {
            console.error("Exam submission error:", error);
            alert(`Failed to submit exam: ${error.message}`);
        }
    };

    // Format time left (HH:MM:SS)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Fixed Header with Time */}
            <div className="fixed top-0 left-0 w-full bg-white backdrop-blur-lg text-blue-500 text-center py-3 shadow-md z-50">
                <span className="text-lg font-semibold tracking-wider">
                    Time Left: {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
                </span>
            </div>

            {/* Exam Details */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{exam.examName}</h2>
                <p className="text-gray-700">{exam.description}</p>
                <p className="text-gray-700">Duration: {exam.duration} minutes</p>
            </div>

            {/* Questions Section */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exam Questions</h2>

                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">Question {index + 1}:</h3>
                            <p className="text-gray-700">{question.questionDescription}</p>

                            <div className="mt-3">
                                {question.choices.map((choice, choiceIndex) => (
                                    <label key={choiceIndex} className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={choice}
                                            checked={answers[index] === choice}
                                            onChange={() => handleOptionChange(index, choice)}
                                            className="form-radio h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-800">{choice}</span>
                                    </label>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSubmit(index)}
                                className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                            >
                                Submit Answer
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No questions found.</p>
                )}
            </div>

            {/* Submit Exam Button */}
            <div className="mt-6 w-full max-w-4xl flex items-center justify-between bg-white shadow-lg p-4 rounded-xl">
                <div className="text-gray-800">
                    <p>Total Questions: <span className="font-semibold">{questions.length}</span></p>
                    <p>Attended: <span className="font-semibold">{attendedCount}</span></p>
                </div>

                <button
                    onClick={handleExamSubmit}
                    className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition"
                >
                    Submit Exam
                </button>
            </div>
        </div>
    );
}
