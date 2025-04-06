import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
    try {
        // Extract query parameters (e.g., ?role=teacher)
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");

        await connectToDatabase();

        // Fetch users, optionally filtered by role
        const query = role ? { role } : {};
        const users = await User.find(query).select("name email role"); // Only return specific fields

        if (!users || users.length === 0) {
            return new Response(
                JSON.stringify({ message: "No users found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Users fetched successfully.",
                users
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred on the server." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}