import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema)
export default Student;