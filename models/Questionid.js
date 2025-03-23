import mongoose from "mongoose";

const questionidSchema = new mongoose.Schema({
    questionid: { type: Object },
    examId:{type:String},
})

const Questionid = mongoose.models.Questionid || mongoose.model('Questionid', questionidSchema)
export default Questionid;