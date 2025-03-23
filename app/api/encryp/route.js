import { NextResponse } from "next/server";
import Questionid from "@/models/Questionid";
import connectToDatabase from "@/lib/db";

export async function GET() {
    try {
        await connectToDatabase();
        
        // Fetch all encrypted question IDs
        const encryptedIds = await Questionid.find({}, "questionid").lean();
        
        // Extract only the question IDs
        const formattedIds = encryptedIds.map(doc => doc.questionid);
        
        return NextResponse.json(formattedIds, { status: 200 });
    } catch (err) {
        console.error("Error fetching encrypted IDs:", err);
        return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
    }
}
