import Admin from "@/models/Admin";
import connectToDatabase from "@/lib/db";

export async function GET(request, { params }) {
    try {
        const { adminId } = await params;

        if (!adminId) {
            return new Response(
                JSON.stringify({ error: "Admin ID is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await connectToDatabase();

        const admin = await Admin.findById(adminId);

        console.log(admin)

        if (!admin) {
            return new Response(
                JSON.stringify({ error: "Admin cannot be found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Admin details fetched successfully.", admin: {
                    email: admin.email,
                    name: admin.name
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
