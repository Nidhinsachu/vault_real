import { NextResponse } from "next/server";
import Chapter from "@/models/Chapter"; // Import the Chapter schema
import connectToDatabase from "@/lib/db"; // Import the database connection utility

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");
    const examId = searchParams.get("examId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const chapters = await Chapter.find({ teacherId, examId });

    const chaptersRes = chapters.map(chapter => ({
      chapterName: chapter.chapterName,
      chapterId: chapter._id
    }));

    return NextResponse.json({ chapters: chaptersRes }, { status: 200 });
  } catch (err) {
    console.error("Error while fetching chapters:", err);
    return NextResponse.json(
      { error: "Server error occurred while fetching chapters" },
      { status: 500 }
    );
  }
}
