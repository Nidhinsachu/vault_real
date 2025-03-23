import { NextResponse } from "next/server";
import Questionid from "@/models/Questionid";
import connectToDatabase from "@/lib/db";

// export async function GET() {
//     try {
//         await connectToDatabase();
//         const encryptedIds = await Questionid.find({}, "questionid");
//         return NextResponse.json(encryptedIds, { status: 200 });
//     } catch (err) {
//         console.error("Error fetching encrypted IDs:", err);
//         return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
//     }
// }
export async function GET() {
    try {
        await connectToDatabase();
        const encryptedIds = await Questionid.find({}, "questionid").lean();  // Convert to plain JS objects
        const formattedIds = encryptedIds.map(doc => doc.questionid);  // Extract only IDs
        
        return NextResponse.json(formattedIds, { status: 200 });  // Return as an array of strings
    } catch (err) {
        console.error("Error fetching encrypted IDs:", err);
        return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
    }
}
