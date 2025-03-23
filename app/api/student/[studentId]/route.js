import Student from "@/models/Student";
import connectToDatabase from "@/lib/db";

export async function GET(request, { params }) {
    try {
        const { studentId } = await params;

        if (!studentId) {
            return new Response(
                JSON.stringify({ error: "Student ID is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await connectToDatabase();

        const student = await Student.findById(studentId);

        console.log(student)

        if (!student) {
            return new Response(
                JSON.stringify({ error: "Student cannot be found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Admin details fetched successfully.", student: {
                    email: student.email,
                    name: student.name
                }
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error retrieving admin ID:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred on the server." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
