import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  chapterName: {
    type: String,
    required: true,
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  questionId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam"
  }
}, { timestamps: true });

const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
export default Chapter;
