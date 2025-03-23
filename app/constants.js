const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const contractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "examID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "examKey",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        }
      ],
      "name": "ExaminationCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "examID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "encryptedIpfsHash",
          "type": "string"
        }
      ],
      "name": "QuestionPaperGenerated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "examID",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "chapterID",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_weightage",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "_questionIDs",
          "type": "string[]"
        }
      ],
      "name": "addChapterQuestions",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_examKey",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_startTime",
          "type": "uint256"
        }
      ],
      "name": "createExamination",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "examCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "examinations",
      "outputs": [
        {
          "internalType": "string",
          "name": "examKey",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalChapters",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "encryptedQuestionPaper",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "examID",
          "type": "uint256"
        }
      ],
      "name": "getEncryptedQuestionPaper",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "examID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "encryptedIpfsHash",
          "type": "string"
        }
      ],
      "name": "storeEncryptedQuestionPaper",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export default {contractAddress,contractAbi}