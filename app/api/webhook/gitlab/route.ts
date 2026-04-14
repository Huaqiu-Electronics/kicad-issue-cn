import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventType = request.headers.get('X-Gitlab-Event');
    const objectKind = body.object_kind;
    let issueIid: number | null = null;
    if (objectKind === 'issue') {
      issueIid = body.object_attributes.iid;
    } else if (objectKind === 'note') {
      if (body.issue) {
        issueIid = body.issue.iid;
      }
    }
    console.log(`[Webhook] Event type: ${eventType}, object kind: ${objectKind}, issue IID: ${issueIid}`);
    console.log('[Webhook] Payload:', JSON.stringify(body, null, 2));
    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Failed to handle webhook' }, { status: 500 });
  }
}
