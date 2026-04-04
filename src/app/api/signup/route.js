import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import dbConnect from '@/lib/db';

export async function POST(req) {
  try {
    await dbConnect();

    const { fullName, dob, email, password } = await req.json();

    if (!fullName || !dob || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      dob,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
