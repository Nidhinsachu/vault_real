import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import ExamAttendance from "@/models/ExamAttendance";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const { examid } = await params;

        if (!examid) {
            return NextResponse.json(
                { error: "Missing examId parameter." },
                { status: 400 }
            );
        }

        const exam = await Exam.findById(examid);

        if (!exam) {
            return NextResponse.json(
                { error: "Exam not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ exam }, { status: 200 });

    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred while retrieving the exam." },
            { status: 500 }
        );
    }
}



export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();

        const { examid } = await params;

        if (!examid) {
            return NextResponse.json(
                { error: "Missing examId parameter." },
                { status: 400 }
            );
        }

        const deletedExam = await Exam.findByIdAndDelete(examid);

        if (!deletedExam) {
            return NextResponse.json(
                { error: "Exam not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Exam deleted successfully.", exam: deletedExam },
            { status: 200 }
        );

    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred while deleting the exam." },
            { status: 500 }
        );
    }
}



export async function POST(req, { params }) {
    try {
        await connectToDatabase();

        const { examid } = params;
        const { studentId, score } = await req.json();
        console.log(examid, studentId, score)

        if (!examid) {
            return NextResponse.json(
                { error: "Missing examId parameter." },
                { status: 400 }
            );
        }

        if (!studentId || score === undefined) {
            return NextResponse.json(
                { error: "Missing studentId or score in request body." },
                { status: 400 }
            );
        }

        // Find existing attendance record for this exam
        let existingExam = await ExamAttendance.findOne({ examId: examid });

        if (existingExam) {
            const studentExists = existingExam.students.some(
                s => s.studentId.toString() === studentId.toString()
            );

            if (studentExists) {
                return NextResponse.json(
                    {
                        error: "Student has already submitted for this exam",
                        attendance: existingExam
                    },
                    { status: 403 }
                );
            }

            existingExam.students.push({
                studentId: studentId,
                score
            });
            await existingExam.save();
        } else {
            existingExam = new ExamAttendance({
                examId: examid,
                students: [{
                    studentId: studentId,
                    score
                }]
            });
            await existingExam.save();
        }

        return NextResponse.json(
            {
                message: "Attendance recorded successfully for new student",
                attendance: existingExam
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred while processing the attendance." },
            { status: 500 }
        );
    }
}


export async function PATCH(req, { params }) {
    try {
        await connectToDatabase();

        const { examid } = params;

        if (!examid) {
            return NextResponse.json(
                { error: "Missing examId parameter." },
                { status: 400 }
            );
        }

        // Find and update the attendance record
        const updatedAttendance = await ExamAttendance.findOneAndUpdate(
            { examId: examid },
            { isPublished: true },
            { new: true }
        );

        if (!updatedAttendance) {
            return NextResponse.json(
                { error: "No attendance record found for this exam." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Results published successfully",
                attendance: updatedAttendance
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred while publishing results." },
            { status: 500 }
        );
    }
}