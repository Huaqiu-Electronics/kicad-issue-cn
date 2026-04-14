import { NextResponse } from 'next/server';
import { listNotes, createNote } from '@/lib/gitlab';
import { issueExists } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ iid: string }> }) {
  try {
    const { iid } = await params;
    const numericIid = parseInt(iid);
    
    if (!issueExists(numericIid)) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    const notes = await listNotes(numericIid);
    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list notes' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ iid: string }> }) {
  try {
    const { iid } = await params;
    const numericIid = parseInt(iid);
    
    if (!issueExists(numericIid)) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    const body = await request.json();
    if (!body.body) {
      return NextResponse.json({ error: 'Body is required' }, { status: 400 });
    }
    const note = await createNote(numericIid, body);
    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
