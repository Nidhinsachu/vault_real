import { NextResponse } from "next/server";
import Student from "@/models/Student";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";

// POST request handler
export async function POST(request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { name, password, confirmpassword, email } = body;

        console.log("password " + password, "confirm password " + confirmpassword);

        // Check if the student already exists
        const studentExistence = await Student.findOne({ email });
        if (studentExistence) {
            console.log("Student already exists");
            return NextResponse.json({ error: "Student already exists" }, { status: 400 });
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            console.log("Passwords do not match");
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new student
        const newStudent = new Student({
            name,
            password: hashedPassword,
            email,
        });

        await newStudent.save();

        return NextResponse.json({ message: "Student Registered" }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: "Error in server" }, { status: 500 });
    }
}
