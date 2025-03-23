import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },
    examDateTime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        default: "", // Optional field; defaults to an empty string if not provided
    },
    adminId: {
        type: String,
        default: "",
    },
    passKey: {
        type: String,
        required: true,
    },
});

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);
export default Exam;
