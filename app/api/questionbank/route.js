import { NextResponse } from "next/server";
import Questionid from "@/models/Questionid";
import connectToDatabase from "@/lib/db";


// Decryption constants
const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef"; // Must be 32 characters

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


export async function POST(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { encryptedAddress,id } = body;
        console.log(encryptedAddress)


        // Create a new id
        const newQuestionid = new Questionid({
            questionid: encryptedAddress,
            examId:id,

        });

        await newQuestionid.save();

        return NextResponse.json({ message: "Question id added" }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}

