import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isSelected: {
        type: Boolean,
        default: false
    }
});

// Prevent model overwrite error
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
