import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Selectedquestions from "@/models/Selectedquestions";

// export async function POST(req) {
//     try {
//         await connectToDatabase();

//         const { questionIds } = await req.json(); // Extract question IDs from request body

//         if (!questionIds || !Array.isArray(questionIds)) {
//             return NextResponse.json({ error: "Invalid data format." }, { status: 400 });
//         }

//         const newEntry = new Selectedquestions({ questionIds });
//         await newEntry.save();

//         return NextResponse.json({ message: "Questions saved successfully!" }, { status: 201 });
//     } catch (err) {
//         console.error("Error storing selected questions:", err);
//         return NextResponse.json({ error: "Failed to save data." }, { status: 500 });
//     }
// }


export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        console.log("Received Data:", body); // ✅ Debugging log

        const { examName, questionIds } = body; // Extract exam name and question IDs

        if (!examName || !questionIds || !Array.isArray(questionIds)) {
            return NextResponse.json({ error: "Invalid data format." }, { status: 400 });
        }

        const newEntry = new Selectedquestions({ examName, questionIds });
        
        await newEntry.save();

        return NextResponse.json({ message: "Questions saved successfully!" }, { status: 201 });
    } catch (err) {
        console.error("Error storing selected questions:", err);
        return NextResponse.json({ error: "Failed to save data." }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectToDatabase();

        console.log("works fine")

        const selectedQuestions = await Selectedquestions.find()

        if (!selectedQuestions.length) {
            return NextResponse.json({ message: "No selected questions found." }, { status: 404 });
        }

        return NextResponse.json(selectedQuestions[0].questionIds, { status: 200 });
    } catch (err) {
        console.error("Error fetching selected questions:", err);
        return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
    }
}
