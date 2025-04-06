import { NextResponse } from "next/server";
import Question from "@/models/Question";
import connectToDatabase from "@/lib/db";
import crypto from "crypto";

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

        console.log(body)
        const { encryptedAddress, examId, teacherId } = body;

        const newQuestion = new Question({
            questionId: encryptedAddress,
            examId,
            teacherId: teacherId,
            isSelected: false
        });

        await newQuestion.save();

        return NextResponse.json({ message: "Question added successfully" }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { questionIds, examId } = body;

        if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
            return NextResponse.json(
                { error: "questionIds array is required for updating." },
                { status: 400 }
            );
        }

        if (!examId) {
            return NextResponse.json(
                { error: "examId is required for updating." },
                { status: 400 }
            );
        }

        const updatedQuestions = await Question.updateMany(
            { questionId: { $in: questionIds }, examId: examId },
            { $set: { isSelected: true } }
        );

        return NextResponse.json(
            { message: `${updatedQuestions.modifiedCount} questions updated successfully.` },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error updating question:", err);
        return NextResponse.json(
            { error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get("teacherId");
        const examId = searchParams.get("examId");
        const attend = searchParams.get("attend");

        if (!examId) {
            return NextResponse.json({ error: "Missing teacherId or examId." }, { status: 400 });
        }

        await connectToDatabase();
        let query = { examId };

        if (attend === "true") {
            query.isSelected = true;
        }

        if (teacherId != null) {
            query.teacherId = teacherId
        }

        const questions = await Question.find(query, "questionId").lean();
        const formattedIds = questions.map(doc => doc.questionId);

        return NextResponse.json(formattedIds, { status: 200 });
    } catch (err) {
        console.error("Error fetching encrypted IDs:", err);
        return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
    }
}
