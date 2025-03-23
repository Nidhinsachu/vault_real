import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";

// POST request handler
export async function POST(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { name, password, confirmpassword, email } = body;

        const adminExistence = await Admin.findOne({ email });
        if (adminExistence) {
            console.log("Admin already exists");
            return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
        }

        if (password !== confirmpassword) {
            console.log("Passwords do not match");
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            password: hashedPassword,
            email,
        });

        await newAdmin.save();
       

        return NextResponse.json({ message: "Admin Registered" }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: "Error in server" }, { status: 500 });
    }
}
