import mongoose from "mongoose";

const questionidSchema = new mongoose.Schema({
    questionid: { type: String, required: true }, // Store encrypted IPFS hash as a string
    examId: { type: String, required: true }, // Store exam ID
}, { timestamps: true }); // Adds createdAt & updatedAt timestamps

const Answerid = mongoose.models.Answerid || mongoose.model("Answerid", questionidSchema);
export default Answerid;
