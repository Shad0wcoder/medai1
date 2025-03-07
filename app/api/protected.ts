import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, 'secret');
    return NextResponse.json({ message: 'Protected data' });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}
