import { NextResponse } from "next/server";
import Question from "@/models/Question"; // Assuming this model stores questions
import Questionid from "@/models/Questionid";
import connectToDatabase from "@/lib/db";
import crypto from "crypto";

// Decryption constants
const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters
const IV_LENGTH = 16; // AES block size

const decrypt = (encryptedText) => {
    const [iv, encrypted] = encryptedText.split(":");
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY),
        Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(Buffer.from(encrypted, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const examId = searchParams.get("examId");

        if (!examId) {
            return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        // Fetch encrypted question ID
        const questionData = await Questionid.findOne({ examId });
        if (!questionData) {
            return NextResponse.json(
                { error: "No question data found for the provided Exam ID" },
                { status: 404 }
            );
        }

        // Decrypt the question ID
        const decryptedId = decrypt(questionData.questionid);

        // Fetch question content using the decrypted ID
        const question = await Question.findOne({ _id: decryptedId });
        if (!question) {
            return NextResponse.json(
                { error: "No question found for the decrypted ID" },
                { status: 404 }
            );
        }

        return NextResponse.json({ questionContent: question.content }, { status: 200 });
    } catch (err) {
        console.error("Error fetching question data:", err);
        return NextResponse.json(
            { error: "An error occurred while fetching the question data." },
            { status: 500 }
        );
    }
}
