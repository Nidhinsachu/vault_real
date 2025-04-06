import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Login successful!",
            token,
            userId: user._id,
            role: user.role
        }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
