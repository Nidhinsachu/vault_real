import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
        trim: true,
    },
    examDateTime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    duration: {
        type: Number,  // Duration in minutes
        required: true,
        min: 1
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    passKey: {
        type: String,
        required: true,
        minlength: 6,
    },
    isExamFinished: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);
export default Exam;
