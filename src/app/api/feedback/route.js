import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Feedback from '@/models/feedback';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, rating, review } = await req.json();

    if (!name || !review) {
      return NextResponse.json(
        { message: 'Name and review are required.' },
        { status: 400 }
      );
    }

    const feedback = new Feedback({ name, rating, review });
    await feedback.save();

    return NextResponse.json(feedback, { status: 201 }); // return the saved feedback
  } catch (error) {
    console.error('Feedback POST error:', error);
    return NextResponse.json(
      { message: 'Error submitting feedback', error: error.message },
      { status: 500 }
    );
  }
}

// GET: Get all feedback
export async function GET() {
  try {
    await dbConnect();
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    return NextResponse.json(allFeedback, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching feedback', error },
      { status: 500 }
    );
  }
}
