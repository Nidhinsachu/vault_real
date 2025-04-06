import mongoose from "mongoose";

const examAttendanceSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
            index: true
        },
        students: [
            {
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                score: {
                    type: Number,
                    required: true,
                    default: 0,
                    min: 0
                }
            }
        ],
        isPublished: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const ExamAttendance = mongoose.models.ExamAttendance || mongoose.model("ExamAttendance", examAttendanceSchema);
export default ExamAttendance;
