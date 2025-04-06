import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET(request, { params }) {
    try {
        const { userid } = await params;

        if (!userid) {
            return new Response(
                JSON.stringify({ error: "User ID is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await connectToDatabase();

        const user = await User.findById(userid);

        console.log(user)

        if (!user) {
            return new Response(
                JSON.stringify({ error: "user cannot be found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                message: "User details fetched successfully.", user: {
                    email: user.email,
                    name: user.name
                }
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error retrieving user ID:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred on the server." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userid } = await params;

        if (!userid) {
            return new Response(
                JSON.stringify({ error: "User ID is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await connectToDatabase();

        const user = await User.findById(userid);

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User cannot be found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        await User.findByIdAndDelete(userid);

        return new Response(
            JSON.stringify({ message: "User deleted successfully." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred on the server." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}