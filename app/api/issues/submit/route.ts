import { NextResponse } from 'next/server';
import { createIssue } from '@/lib/gitlab';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get('title') || 'Bug Report';
    const description = url.searchParams.get('issue[description]') || url.searchParams.get('description');
    const labels = url.searchParams.get('labels');
    const version = url.searchParams.get('version');
    const platform = url.searchParams.get('platform');

    if (!title || !description) {
      return new Response(
        `<html>
          <body>
            <h1>Error</h1>
            <p>Title and description are required</p>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' }, status: 400 }
      );
    }

    // Check if user is logged in
    const user = await getCurrentUser();

    if (user) {
      // Logged-in user: create GitLab issue directly
      const issueLabels = labels ? labels.split(',').map((label: string) => label.trim()) : [];
      issueLabels.push('cn-user');
      
      const issueData = {
        title,
        description,
        labels: issueLabels
      };

      const gitlabIssue = await createIssue(issueData);

      // Create local issue record
      const localIssue = await prisma.issue.create({
        data: {
          gitlabIid: gitlabIssue.iid,
          title,
          userId: user.id
        }
      });

      // Return HTML that redirects using JavaScript
      return new Response(
        `<html>
          <head>
            <meta http-equiv="refresh" content="0;url=/issues/${gitlabIssue.iid}">
            <script>window.location.href = "/issues/${gitlabIssue.iid}"</script>
          </head>
          <body>
            <p>Redirecting to issue #${gitlabIssue.iid}...</p>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    } else {
      // Guest user: create GuestIssue
      const guestIssue = await prisma.guestIssue.create({
        data: {
          title,
          description,
          labels,
          version,
          platform
        }
      });

      // Return HTML that redirects using JavaScript
      return new Response(
        `<html>
          <head>
            <meta http-equiv="refresh" content="0;url=/issues/guest/${guestIssue.id}">
            <script>window.location.href = "/issues/guest/${guestIssue.id}"</script>
          </head>
          <body>
            <p>Redirecting to guest issue page...</p>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/issues/submit:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit issue';
    return new Response(
      `<html>
        <body>
          <h1>Error</h1>
          <p>${errorMessage}</p>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 500 }
    );
  }
}
