import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/saved',
  '/inquiries',
  '/properties',
  '/add-property',
  '/edit-property',
  '/leads',
];

// Admin only routes
const adminRoutes = [
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

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
