import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/notes';

export async function POST(req) {
  try {
    await dbConnect();
    const { content } = await req.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }

    const note = new Note({ content });
    await note.save();
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating note', error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching notes', error }, { status: 500 });
  }
}