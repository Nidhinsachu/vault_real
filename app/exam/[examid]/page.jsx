"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ethers, BrowserProvider } from "ethers";
import { useSearchParams } from "next/navigation";


const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters

const textToUint8Array = (text) => new TextEncoder().encode(text);
const uint8ArrayToText = (array) => new TextDecoder().decode(array);
const base64ToUint8Array = (base64) => new Uint8Array([...atob(base64)].map(char => char.charCodeAt(0)));
const uint8ArrayToBase64 = (array) => btoa(String.fromCharCode(...array));

const getKey = async () => {
    return crypto.subtle.importKey("raw", textToUint8Array(ENCRYPTION_KEY), { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
};

const encrypt = async (text) => {
    if (!text) return null;
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, textToUint8Array(text));
    return uint8ArrayToBase64(iv) + ":" + uint8ArrayToBase64(new Uint8Array(encrypted));
};

const decrypt = async (encryptedText) => {
    if (!encryptedText) return null;
    const [ivBase64, encryptedBase64] = encryptedText.split(":");
    const key = await getKey();
    const iv = base64ToUint8Array(ivBase64);
    const encryptedData = base64ToUint8Array(encryptedBase64);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, encryptedData);
    return uint8ArrayToText(new Uint8Array(decrypted));
};

const CONTRACT_ADDRESS = "0x2634827e63173EabfCee85695041B3cE6D60D973";
const ABI = [
    {
        inputs: [{ internalType: "string[]", name: "_questions", type: "string[]" }],
        name: "addQuestions",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "selectRandomQuestions",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getSelectedQuestions",
        outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "sender", type: "address" },
            { indexed: false, internalType: "string[]", name: "selectedQuestions", type: "string[]" },
        ],
        name: "QuestionsSelected",
        type: "event",
    },
];


export default function QuestionBankForm() {
    const router = useRouter();
    const { examid } = useParams();
    const searchParams = useSearchParams();
    const isExamFinished = searchParams ? searchParams.get("isExamFinished") === "true" : false;

    const [chapterName, setChapterName] = useState("");
    const [questionDescription, setQuestionDescription] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [weightage, setWeightage] = useState([]);
    const [chapters, setChapters] = useState([]);
    const teacherId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [questionIds, setQuestionIds] = useState([]);
    const [txHash, setTxHash] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const web3Provider = new BrowserProvider(window.ethereum);
                setProvider(web3Provider);
            } catch (error) {
                console.error("Failed to create Web3Provider:", error);
            }
        } else {
            console.error("MetaMask or any Ethereum provider is not detected.");
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!teacherId || !examid) return;
            try {
                const response = await fetch(`/api/chapter?teacherId=${teacherId}&examId=${examid}`);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.chapters)
                    setChapters(data.chapters);
                } else {
                    console.error("Failed to fetch chapters:", response.status);
                }

            } catch (error) {
                console.error("Error fetching chapters:", error);
            }
        };

        fetchData();
    }, [teacherId, examid]);

    const handleChoiceChange = (index, value) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handlefinish = async (e) => {
        try {
            const response = await axios.patch("/api/exam", {
                examId: examid,
                updates: {
                    isExamFinished: true
                }
            });

            if (response.status === 200) {
                router.replace(`/exam/${examid}?isExamFinished=true`);
            }
        } catch (error) {
            console.error("Error finishing exam:", error);
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { chapterName, questionDescription, choices, correctAnswer, weightage };

        try {
            const ipfsUrl = await storeDataOnIPFS(formData);
            if (ipfsUrl) alert(`Question submitted! IPFS URL: ${ipfsUrl}`);
        } catch (error) {
            console.error("Submission failed:", error);
        }
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

            const teacherId = localStorage.getItem("userId");

            const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            const encryptedAddress = await encrypt(response.data.IpfsHash);
            await axios.post("/api/question", { encryptedAddress, examId: examid, teacherId });

            return fileUrl;
        } catch (error) {
            console.error("Error storing data on IPFS:", error.message || error);
            return null;
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) return alert("MetaMask is not installed!");
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x13882" }],
            });

            const web3Provider = new BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const signer = await web3Provider.getSigner();
            setProvider(web3Provider);
            setSigner(signer);

            alert("Wallet connected to Polygon Amoy!");
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    };


    const addQuestionsToBlockchain = async () => {
        if (!signer) return alert("Connect your wallet first!");
        try {
            const response = await axios.get(`/api/question?teacherId=${teacherId}&examId=${examid}`);

            if (response.status !== 200 || !response.data || response.data.length === 0) {
                return alert("No questions to add! API might be empty.");
            }

            setQuestionIds(response.data);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            const tx = await contract.addQuestions(response.data);
            await tx.wait();

            setTxHash(tx.hash);
            alert("Questions added to blockchain on Polygon Amoy!");
        } catch (error) {
            console.error("Error adding questions:", error);
        }
    };


    const storeRandomQuestions = async () => {
        if (!signer) return alert("Connect your wallet first!");
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            const tx = await contract.selectRandomQuestions();
            await tx.wait();
            setTxHash(tx.hash);
            alert("Random questions stored on blockchain!");

            const eventFilter = contract.filters.QuestionsSelected(null);
            const events = await contract.queryFilter(eventFilter);

            if (events.length === 0) {
                alert("No event logs found! Try again after storing random questions.");
                return;
            }

            const latestEvent = events[events.length - 1];
            const selected = latestEvent.args.selectedQuestions;

            if (selected.length > 0) {
                const response = await axios.patch("/api/question", {
                    questionIds: selected,
                    examId: examid
                });

                console.log("Response from server:", response.data);
            }

            router.push("/dashboard/teacher");
        } catch (error) {
            console.error("Error storing random questions:", error);
        }
    };


    // const getSelectedQuestionsFromEvents = async () => {
    //     if (!provider) return alert("Connect your wallet first!");
    //     try {
    //         const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    //         const eventFilter = contract.filters.QuestionsSelected(null);
    //         const events = await contract.queryFilter(eventFilter);

    //         if (events.length === 0) {
    //             alert("No event logs found! Try again after storing random questions.");
    //             return;
    //         }

    //         const latestEvent = events[events.length - 1];
    //         const selected = latestEvent.args.selectedQuestions;

    //         if (selected.length > 0) {
    //             const response = await axios.patch("/api/question", {
    //                 questionIds: selected,
    //                 examId: examid
    //             });

    //             console.log("Response from server:", response.data);
    //         }

    //         setSelectedQuestions(selected);
    //         router.push("/dashboard/teacher");
    //     } catch (error) {
    //         console.error("Error fetching event logs:", error);
    //     }
    // };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            {isExamFinished ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
                    <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            CREATE THE QUESTION PAPER <span className="text-indigo-500"></span>
                        </h1>

                        <button
                            onClick={connectWallet}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition mb-4"
                        >
                            Connect Wallet
                        </button>

                        <button
                            onClick={addQuestionsToBlockchain}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-4"
                        >
                            Add Questions to Blockchain
                        </button>

                        <h3 className="text-gray-700 font-medium">Added {questionIds.length} Questions</h3>

                        <button
                            onClick={storeRandomQuestions}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition my-4"
                        >
                            Select Random Questions
                        </button>

                        {/* <button
                            onClick={getSelectedQuestionsFromEvents}
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition mb-4"
                        >
                            Retrieve Selected Questions
                        </button>

                        <h3 className="text-gray-700 font-medium">Selected Questions: {selectedQuestions.join(", ")}</h3> */}

                        {txHash && (
                            <p className="mt-4 text-sm text-gray-600">
                                Transaction Hash:{" "}
                                <a
                                    href={`https://amoy.polygonscan.com/tx/${txHash}`}
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    {txHash}
                                </a>
                            </p>
                        )}
                    </div>
                </div>

            ) : (
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Question Bank</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 text-black">
                        <label className="block">
                            <span className="text-gray-700">Pick Chapter Name:</span>
                            <select
                                value={chapterName}
                                onChange={(e) => setChapterName(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                            >
                                <option value="">Select Chapter</option>
                                {chapters.length > 0
                                    ? chapters.map((chapter) => (
                                        <option key={chapter.chapterId} value={chapter.chapterName}>
                                            {chapter.chapterName}
                                        </option>
                                    ))
                                    : <option>No chapters available</option>}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Enter Question Description:</span>
                            <textarea
                                value={questionDescription}
                                onChange={(e) => setQuestionDescription(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                                rows={4}
                            />
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Enter Multiple Choices:</span>
                            <div className="space-y-2 mt-2">
                                {choices.map((choice, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={choice}
                                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                                        className="block w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                                        placeholder={`Choice ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </label>

                        <label className="block">
                            <span className="text-gray-700">Pick The Correct Answer:</span>
                            <input
                                type="text"
                                value={correctAnswer}
                                onChange={(e) => setCorrectAnswer(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Submit
                        </button>

                    </form>
                    <button onClick={handlefinish}
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 mt-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Finish
                    </button>
                </div>
            )}
        </div>
    );
}
