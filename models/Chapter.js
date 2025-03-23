import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  chapterName: { type: String, required: true }, // The chapter name is mandatory
  createdAt: { type: Date, default: Date.now },
  adminId: {
    type: String,
    default: "",
}  // Automatically store the creation timestamp
});

const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
export default Chapter;




