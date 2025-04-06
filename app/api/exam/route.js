import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import Chapter from "@/models/Chapter";
import ExamAttendance from "@/models/ExamAttendance";

export async function POST(request) {
    try {
        const body = await request.json();
        await connectToDatabase();
        const { examName, examDateTime, description, teacherId, passKey, duration, chapters } = body;

        if (!teacherId) {
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
        const examExists = await Exam.findOne({ examName, examDateTime, teacherId });
        if (examExists) {
            return NextResponse.json(
                { error: "Exam with the same name and date/time already exists." },
                { status: 400 }
            );
        }

        const newExam = new Exam({
            examName,
            examDateTime: new Date(examDateTime), // Convert string to Date
            description: description || "",
            duration,
            teacherId,
            passKey,
            isExamFinished: false
        });

        if (chapters && Array.isArray(chapters) && chapters.length > 0) {
            const chapterDocs = chapters.map(chapterName => ({
                chapterName,
                teacherId,
                examId: newExam._id
            }));

            await Chapter.insertMany(chapterDocs);
        }


        const savedExam = await newExam.save();

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



export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const passKey = searchParams.get("passkey");
        const teacherId = searchParams.get("teacherId");

        if (passKey) {
            const exam = await Exam.findOne({ passKey });

            if (!exam) {
                return NextResponse.json({ error: "Invalid passkey." }, { status: 404 });
            }

            const currentTime = new Date();
            const examTime = new Date(exam.examDateTime);
            const tenMinutesLater = new Date(examTime.getTime() + 18000 * 60000);

            if (currentTime < examTime || currentTime > tenMinutesLater) {
                return NextResponse.json({ error: "Exam access period has ended." }, { status: 403 });
            }

            return NextResponse.json({ examId: exam._id }, { status: 200 });
        }

        if (teacherId) {
            const exams = await Exam.find({ teacherId });

            const examAttendanceResponses = await Promise.all(
                exams.map(async (exam) => {
                    const attendance = await ExamAttendance
                        .findOne({ examId: exam._id })
                        .populate({
                            path: "students.studentId",
                            select: "_id name"
                        })
                        .exec();
                    return {
                        examId: exam._id,
                        examName: exam.examName,
                        attendance
                    };
                })
            );

            return NextResponse.json(
                {
                    exams,
                    attendance: examAttendanceResponses
                },
                { status: 200 }
            );
        } else {
            const exams = await Exam.find({}, { examName: 1 })

            return NextResponse.json({ exams }, { status: 200 })
        }


    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred while retrieving exams." },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { examId, updates } = body;

        if (!examId || !updates || typeof updates !== "object") {
            return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
        }

        const updatedExam = await Exam.findOneAndUpdate(
            { _id: examId },
            { $set: updates },
            { new: true }
        );

        if (!updatedExam) {
            return NextResponse.json({ error: "Exam not found." }, { status: 404 });
        }
        return NextResponse.json({ message: "Exam updated successfully", updatedExam }, { status: 200 });
    } catch (err) {
        console.error("Error updating exam:", err);
        return NextResponse.json(
            { error: "Failed to update exam." },
            { status: 500 }
        );
    }
}


export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const examId = searchParams.get("id");

        if (!examId) {
            return NextResponse.json(
                { error: "Exam ID is required for deletion." },
                { status: 400 }
            );
        }

        await connectToDatabase();

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
