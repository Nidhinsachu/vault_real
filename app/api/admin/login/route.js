import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const body = await request.json();
        
        await connectToDatabase();

        const { password, email } = body;
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        const admin = await Admin.findOne({ email });

        console.log("admin data", admin);

        if (!admin) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "Login successful", admin: { email: admin.email , adminId: admin._id} },
            { status: 200 }
        );
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json(
            { error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}
