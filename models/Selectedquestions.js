// import mongoose from "mongoose";

// const selectedQuestionsSchema = new mongoose.Schema(
//     {
//         questionIds: {
//             type: [String],
//             required: true,
//         },
//     },
//     { timestamps: true }
// );

// const SelectedQuestions =
//     mongoose.models.SelectedQuestions || mongoose.model("SelectedQuestions", selectedQuestionsSchema);

// export default SelectedQuestions;


import mongoose from "mongoose";

const selectedQuestionsSchema = new mongoose.Schema(
    {
        
        examName: { 
            type: String, 
            required: true 
        },
        questionIds: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Questionid", 
                required: true,
            }
        ],
    },
    { timestamps: true }
);

// ✅ Ensure the model is correctly registered
const SelectedQuestions = mongoose.models.SelectedQuestions || mongoose.model("SelectedQuestions", selectedQuestionsSchema);

export default SelectedQuestions;
