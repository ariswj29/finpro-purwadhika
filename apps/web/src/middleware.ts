import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  if (!token) {
    if (pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  if (role === 'USER' && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (role === 'ADMIN') {
    if (
      pathname.startsWith('/admin/users') ||
      pathname.startsWith('/admin/stores')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Hanya terapkan middleware pada path yang dimulai dengan /admin
};
