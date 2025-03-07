import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id).select(
      "-password -createdAt -updatedAt"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}


export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, SECRET_KEY);
        console.log("Decoded user ID:", decoded.id);

        const body = await req.json();
        console.log("Request body:", body);

        const updatedUser = await User.findByIdAndUpdate(decoded.id, body, { new: true }).select("-password");

        if (!updatedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ message: "Profile updated", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }
}
