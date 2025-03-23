import { NextResponse } from "next/server";
import Exam from "@/models/Examregistration";
import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { examName, examDateTime, description, adminId, passKey } = body;


        if (!adminId) {
            return NextResponse.json(
                { error: "Admin ID is required." },
                { status: 400 }
            );
        }

        // Validation for required fields
        if (!examName || !examDateTime) {
            return NextResponse.json(
                { error: "Exam name and date/time are required." },
                { status: 400 }
            );
        }

        // Check if the exam with the same name and date already exists
        const examExists = await Exam.findOne({ examName, examDateTime });
        if (examExists) {
            return NextResponse.json(
                { error: "Exam with the same name and date/time already exists." },
                { status: 400 }
            );
        }

        // Create a new exam
        const newExam = new Exam({
            examName,
            examDateTime: new Date(examDateTime), // Convert string to Date
            description: description || "",
            adminId,
            passKey: passKey
        });

        const savedExam = await newExam.save();

        console.log(savedExam)

        // Include the ID in the response payload
        return NextResponse.json(
            { id: savedExam._id, message: "Exam Registered Successfully" },
            { status: 201 }
        );
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}

// GET: Retrieve all exams
export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const passkey = searchParams.get("passkey");


        let exams;
        if (passkey) {
            const exam = await Exam.findOne({ passKey: passkey });



            if (!exam) {
                return NextResponse.json({ error: "Invalid passkey." }, { status: 404 });
            }

            const currentTime = new Date();
            const examTime = new Date(exam.examdate);
            const tenMinutesLater = new Date(examTime.getTime() + 100 * 60000);

            if (currentTime < examTime || currentTime > tenMinutesLater) {
                return NextResponse.json({ error: "Exam access period has ended." }, { status: 403 });
            }

            return NextResponse.json({ exam }, { status: 200 });
        } else {
            exams = await Exam.find();
        }

        return NextResponse.json({ exams }, { status: 200 });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred while retrieving exams." },
            { status: 500 }
        );
    }
}


// DELETE: Remove an exam by ID
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const examId = searchParams.get("id"); // Expect `id` as a query parameter

        if (!examId) {
            return NextResponse.json(
                { error: "Exam ID is required for deletion." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find and delete the exam by ID
        const deletedExam = await Exam.findByIdAndDelete(examId);

        if (!deletedExam) {
            return NextResponse.json(
                { error: "Exam not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Exam deleted successfully." },
            { status: 200 }
        );
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}
