import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // For now, we'll let the client-side handle authentication
  // In production, you would verify the Firebase token here

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/saved/:path*',
    '/inquiries/:path*',
    '/properties/:path*',
    '/add-property/:path*',
    '/edit-property/:path*',
    '/leads/:path*',
    '/admin/:path*',
  ],
};
