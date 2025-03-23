import { NextResponse } from "next/server";
import Questionid from "@/models/Answerid";
import connectToDatabase from "@/lib/db";

// Encryption key (must be 32 characters)
const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; 

export async function POST(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { encryptedIpfsHash, id } = body;
        console.log("Received encrypted hash:", encryptedIpfsHash);

        // Store encrypted IPFS hash in database
        const newQuestionid = new Questionid({
            questionid: encryptedIpfsHash,
            examId: id,
        });

        await newQuestionid.save();

        return NextResponse.json({ message: "Encrypted IPFS hash stored successfully" }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}
