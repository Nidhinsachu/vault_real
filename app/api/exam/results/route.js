import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ExamAttendance from "@/models/ExamAttendance";

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        console.log("works here , inside results")

        if (!userId) {
            return NextResponse.json(
                { error: "Missing userId parameter." },
                { status: 400 }
            );
        }

        const attendedExams = await ExamAttendance.find({ 
            "students.studentId": userId 
        })
        .populate("examId", "examName examDateTime")
        .lean();

        console.log(attendedExams)

        if (!attendedExams.length) {
            return NextResponse.json(
                { message: "No exams found for this student." },
                { status: 404 }
            );
        }

        const examsWithScores = attendedExams.map(attendance => {
            const student = attendance.students.find(s => s.studentId.toString() === userId);
            return {
                examId: attendance.examId._id,
                title: attendance.examId.examName,
                date: attendance.examId.examDateTime,
                score: student ? student.score : 0
            };
        });

        return NextResponse.json({ exams: examsWithScores }, { status: 200 });

    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred while retrieving the exams." },
            { status: 500 }
        );
    }
}
