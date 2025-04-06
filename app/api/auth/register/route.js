import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        if (!["teacher", "student"].includes(role)) {
            return NextResponse.json({ error: "Invalid role." }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });

        await newUser.save();

        return NextResponse.json({
            message: "User registered successfully!",
            userId: newUser._id,
            role: newUser.role
        }, { status: 201 });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
