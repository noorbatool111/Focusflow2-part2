import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/notes';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
    }

    const note = await Note.findById(id);
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { content } = await req.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Updated content must be a valid string' }, { status: 400 });
    }

    const updated = await Note.findByIdAndUpdate(id, { content }, { new: true });
    if (!updated) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}