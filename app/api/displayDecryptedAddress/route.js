import { NextResponse } from "next/server";
import Questionid from "@/models/Questionid";
import connectToDatabase from "@/lib/db";
import crypto from "crypto";
import { createHelia } from "helia";
import { json } from "@helia/json";

// Encryption Constants
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
        console.error("Decryption failed:", error);
        return null;
    }
};

export async function GET() {
    try {
        await connectToDatabase();

        // Fetch the latest question entry from DB
        const question = await Questionid.findOne().sort({ _id: -1 });

        if (!question) {
            return NextResponse.json({ error: "No data found" }, { status: 404 });
        }

        // Decrypt IPFS CID
        const decryptedCID = decrypt(question.questionid);
        if (!decryptedCID) {
            return NextResponse.json({ error: "Decryption failed" }, { status: 500 });
        }

        // Fetch the question data from IPFS
        const helia = await createHelia();
        const j = json(helia);
        const questionData = await j.get(decryptedCID);

        return NextResponse.json({ questionData }, { status: 200 });

    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: "An error occurred on the server." }, { status: 500 });
    }
}
