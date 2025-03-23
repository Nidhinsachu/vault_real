import { NextResponse } from "next/server";
import Chapter from "@/models/Chapter"; // Import the Chapter schema
import connectToDatabase from "@/lib/db"; // Import the database connection utility

// POST: Save a chapter
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    await connectToDatabase(); // Ensure a database connection

    const { chapterName , adminId } = body;

    console.log("Received Chapter Name: ", chapterName);

    // Check if the chapter name is provided
    if (!chapterName) {
      return NextResponse.json(
        { error: "Chapter name is required" },
        { status: 400 }
      );
    }

    // Check if the chapter already exists in the database
    const existingChapter = await Chapter.findOne({ chapterName });
    if (existingChapter) {
      console.log("Chapter already exists");
      return NextResponse.json(
        { error: "Chapter already exists" },
        { status: 400 }
      );
    }

    // Create a new chapter
    const newChapter = new Chapter({
      chapterName,
      adminId,
    });

    await newChapter.save();

    console.log("Chapter saved successfully");
    return NextResponse.json(
      { message: "Chapter saved successfully", chapter: newChapter },
      { status: 201 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Server error occurred while saving the chapter" },
      { status: 500 }
    );
  }
}

// // GET: Retrieve all chapters
// export async function GET() {
//   try {
//     await connectToDatabase(); // Ensure a database connection

//     // Fetch all chapters
//     const chapters = await Chapter.find();
//     return NextResponse.json(chapters, { status: 200 });
//   } catch (err) {
//     console.error("Server error:", err);
//     return NextResponse.json(
//       { error: "Server error occurred while fetching chapters" },
//       { status: 500 }
//     );
//   }
// }


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase(); // Ensure a database connection

    // Fetch chapters filtered by adminId
    const chapters = await Chapter.find({ adminId });

    return NextResponse.json(chapters, { status: 200 });
  } catch (err) {
    console.error("Error while fetching chapters:", err);
    return NextResponse.json(
      { error: "Server error occurred while fetching chapters" },
      { status: 500 }
    );
  }
}
