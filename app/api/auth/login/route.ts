import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

        // 🔹 Include all necessary fields in the response
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",        // Ensure fields exist
            address: user.address || "",
            bloodType: user.bloodType || "",
            avatar: user.avatar || "/profile.jpeg",
        };

        const response = NextResponse.json({ user: userData, token });
        response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });

        return response;
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
