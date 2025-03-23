"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use the correct router for App Router

const EnterChapters = () => {
  const [chapterName, setChapterName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Correct hook for App Router

  const handleNext = async () => {
    if (!chapterName.trim()) {
      setError("Chapter name is required");
      return;
    }
    const adminId = localStorage.getItem("adminId");
    try {
      const response = await fetch("/api/enterchapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chapterName ,adminId}),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "An error occurred");
        return;
      }

      setChapterName("");
      setError("");
    } catch (err) {
      console.error("Error while saving chapter:", err);
      setError("Server error occurred. Please try again later.");
    }
  };

  const handleFinish = () => {
    router.push("/questionbank"); // Navigate to the next page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          marginBottom: "20px",
          color: "#000",
        }}
      >
        Enter Chapter Names
      </h2>
      <input
        type="text"
        value={chapterName}
        onChange={(e) => setChapterName(e.target.value)}
        placeholder="Chapter Name"
        style={{
          padding: "10px",
          width: "300px",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "5px",
          textAlign: "center",
          marginBottom: "10px",
          color: "white",
        }}
      />
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "0.9rem",
            marginBottom: "10px",
          }}
        >
          {error}
        </p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <button
          onClick={handleNext}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Next
        </button>
        <button
          onClick={handleFinish}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default EnterChapters;
