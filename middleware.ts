import { NextRequest, NextResponse } from 'next/server';

// List of supported languages
const supportedLanguages = ['zh', 'en'];

// Default language
const defaultLanguage = 'zh';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/messages/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check if the path already has a language prefix
  const languagePrefix = pathname.split('/')[1];

  // If the path doesn't have a language prefix, redirect to default language
  if (!supportedLanguages.includes(languagePrefix)) {
    const url = new URL(request.url);
    url.pathname = `/${defaultLanguage}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|messages).*)',
};
