import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);
    const response = NextResponse.next({ request: { headers: requestHeaders } });

    const isAdminRoute = pathname.startsWith('/admin');
    const isAdminLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login');

    if (isAdminRoute && !isAdminLogin) {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*'],
};
