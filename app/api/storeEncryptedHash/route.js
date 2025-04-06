import EncryptedHash from "@/models/EncryptedHash";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 bytes
const IV_LENGTH = 16; // AES-CBC requires a 16-byte IV

const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "utf-8"), iv);
    let encrypted = cipher.update(text, "utf-8", "base64");
    encrypted += cipher.final("base64");
    return iv.toString("base64") + ":" + encrypted;
};

export async function POST(req) {
    try {
        await connectToDatabase(); // Ensure database connection

        const { encryptedIpfsHash } = await req.json(); // Parse JSON request body
        if (!encryptedIpfsHash) {
            return NextResponse.json({ error: "Missing IPFS hash" }, { status: 400 });
        }

        // Encrypt the IPFS hash before storing it
       // const encryptedHash = encrypt(ipfsHash);

        // Store in MongoDB using Mongoose model
        const newHash = new EncryptedHash({ encryptedHash:encryptedIpfsHash });
        const savedHash = await newHash.save();

        return NextResponse.json(
            { message: "Encrypted hash stored successfully", id: savedHash._id },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error storing encrypted hash:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function GET() {
    try {
        await connectToDatabase(); // Ensure database connection

        const encryptedHashes = await EncryptedHash.find({}, "encryptedHash").lean(); // Retrieve all encrypted hashes
        const formattedHashes = encryptedHashes.map(doc => doc.encryptedHash); // Extract only hash values

        return NextResponse.json(formattedHashes, { status: 200 }); // Return as an array
    } catch (error) {
        console.error("Error retrieving encrypted hashes :", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}