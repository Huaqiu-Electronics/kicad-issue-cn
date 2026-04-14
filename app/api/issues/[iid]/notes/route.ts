import { NextResponse } from 'next/server';
import { listNotes, createNote } from '@/lib/gitlab';

export async function GET(request: Request, { params }: { params: Promise<{ iid: string }> }) {
  try {
    const { iid } = await params;
    const notes = await listNotes(parseInt(iid));
    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list notes' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ iid: string }> }) {
  try {
    const { iid } = await params;
    const body = await request.json();
    if (!body.body) {
      return NextResponse.json({ error: 'Body is required' }, { status: 400 });
    }
    const note = await createNote(parseInt(iid), body);
    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
