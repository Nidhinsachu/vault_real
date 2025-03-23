// "use client";

// import { useState, useEffect } from "react";
// import { ethers, BrowserProvider } from "ethers";
// import axios from "axios";

// const CONTRACT_ADDRESS = "0x2634827e63173EabfCee85695041B3cE6D60D973"; // Replace with your contract address
// const ABI = [
//   {
//     inputs: [{ internalType: "string[]", name: "_questions", type: "string[]" }],
//     name: "addQuestions",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "selectRandomQuestions",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getSelectedQuestions",
//     outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: "address", name: "sender", type: "address" },
//       { indexed: false, internalType: "string[]", name: "selectedQuestions", type: "string[]" },
//     ],
//     name: "QuestionsSelected",
//     type: "event",
//   },
// ];

// export default function QuestionBank() {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [questionIds, setQuestionIds] = useState([]);
//   const [selectedQuestions, setSelectedQuestions] = useState([]);
//   const [txHash, setTxHash] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined" && window.ethereum) {
//       try {
//         const web3Provider = new BrowserProvider(window.ethereum);
//         setProvider(web3Provider);
//       } catch (error) {
//         console.error("Failed to create Web3Provider:", error);
//       }
//     } else {
//       console.error("MetaMask or any Ethereum provider is not detected.");
//     }
//   }, []);

//   const connectWallet = async () => {
//     if (!window.ethereum) return alert("MetaMask is not installed!");
//     try {
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: "0x13882" }],
//       }); 

//       const web3Provider = new BrowserProvider(window.ethereum);
//       await window.ethereum.request({ method: "eth_requestAccounts" });

//       const signer = await web3Provider.getSigner();
//       setProvider(web3Provider);
//       setSigner(signer);

//       alert("Wallet connected to Polygon Amoy!");
//     } catch (error) {
//       console.error("Wallet connection failed:", error);
//     }
//   };

//   const addQuestionsToBlockchain = async () => {
//     if (!signer) return alert("Connect your wallet first!");
//     try {
//       const response = await axios.get("/api/getEncryptedIds");

//       if (response.status !== 200 || !response.data || response.data.length === 0) {
//         return alert("No questions to add! API might be empty.");
//       }
//       setQuestionIds(response.data);

//       const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
//       const tx = await contract.addQuestions(response.data);
//       await tx.wait();

//       setTxHash(tx.hash);
//       alert("Questions added to blockchain on Polygon Amoy!");
//     } catch (error) {
//       console.error("Error adding questions:", error);
//     }
//   };

//   const storeRandomQuestions = async () => {
//     if (!signer) return alert("Connect your wallet first!");
//     try {
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
//       const tx = await contract.selectRandomQuestions();
//       await tx.wait();
//       setTxHash(tx.hash);
//       alert("Random questions stored on blockchain!");
//     } catch (error) {
//       console.error("Error storing random questions:", error);
//     }
//   };


 
//   const getSelectedQuestionsFromEvents = async () => {
//     if (!provider) return alert("Connect your wallet first!");
//     try {
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

//       const eventFilter = contract.filters.QuestionsSelected(null);
//       const events = await contract.queryFilter(eventFilter);
     

//       if (events.length === 0) {
//         alert("No event logs found! Try again after storing random questions.");
//         return;
//       }

     
//       const latestEvent = events[events.length - 1];
//       const selected = latestEvent.args.selectedQuestions;

//       if (selected.length > 0) {
//         const response = await axios.post("/api/selectedquestions", {
//           questionIds: selected,
          
//         });

//         console.log("Response from server:", response.data);
//       }

//       setSelectedQuestions(selected);
//     } catch (error) {
//       console.error("Error fetching event logs:", error);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Blockchain-Based Question Bank (Polygon Amoy)</h1>

//       <button onClick={connectWallet}>Connect Wallet</button>
//       <br />
//       <br />

//       <button onClick={addQuestionsToBlockchain}>Add Questions to Blockchain</button>
//       <h3>Added {questionIds.length} Questions</h3>
//       <br />

//       <button onClick={storeRandomQuestions}>Store 5 Random Questions</button>
//       <br />
//       <br />

//       <button onClick={getSelectedQuestionsFromEvents}>Retrieve Selected Questions</button>
//       <h3>Selected Questions: {selectedQuestions.join(", ")}</h3>
      
      

//       {txHash && (
//         <p>
//           Transaction Hash:{" "}
//           <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank">
//             {txHash}
//           </a>
//         </p>
//       )}
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import axios from "axios";

const CONTRACT_ADDRESS = "0x2634827e63173EabfCee85695041B3cE6D60D973"; // Replace with your contract address
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

export default function QuestionBank() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [questionIds, setQuestionIds] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
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
      const response = await axios.get("/api/getEncryptedIds");

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
    } catch (error) {
      console.error("Error storing random questions:", error);
    }
  };

  const getSelectedQuestionsFromEvents = async () => {
    if (!provider) return alert("Connect your wallet first!");
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const eventFilter = contract.filters.QuestionsSelected(null);
      const events = await contract.queryFilter(eventFilter);
      
      if (events.length === 0) {
        alert("No event logs found! Try again after storing random questions.");
        return;
      }

      const latestEvent = events[events.length - 1];
      const selected = latestEvent.args.selectedQuestions;
      
      if (selected.length > 0) {
        const examName = localStorage.getItem("examName") || "Unknown Exam";
        const response = await axios.post("/api/selectedquestions", {
          examName,
          questionIds: selected,
        });
        console.log("Response from server:", response.data);
        console.log(examName);
      }

      setSelectedQuestions(selected);
    } catch (error) {
      console.error("Error fetching event logs:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Blockchain-Based Question Bank (Polygon Amoy)</h1>

      <button onClick={connectWallet}>Connect Wallet</button>
      <br /><br />

      <button onClick={addQuestionsToBlockchain}>Add Questions to Blockchain</button>
      <h3>Added {questionIds.length} Questions</h3>
      <br />

      <button onClick={storeRandomQuestions}>Store 5 Random Questions</button>
      <br /><br />

      <button onClick={getSelectedQuestionsFromEvents}>Retrieve Selected Questions</button>
      <h3>Selected Questions: {selectedQuestions.join(", ")}</h3>
      
      {txHash && (
        <p>
          Transaction Hash: <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank">{txHash}</a>
        </p>
      )}
    </div>
  );
}
