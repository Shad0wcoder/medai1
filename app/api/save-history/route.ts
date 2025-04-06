import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { email, history } = body;

    if (!email || !history || !history.diagnosis || !Array.isArray(history.chat)) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new history entry
    const newEntry = {
      date: new Date(),
      diagnosis: history.diagnosis,
      symptoms: history.symptoms || [],
      chat: history.chat
    };

    user.medicalHistory.push(newEntry);
    await user.save();

    return NextResponse.json({ message: 'History saved', user });
  } catch (error) {
    console.error('Error saving history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
