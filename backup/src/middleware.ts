import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import type { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isAdminLoginPage = req.nextUrl.pathname === "/admin/login";

    // Handle admin routes
    if (isAdminPage) {
      if (!isAuth && !isAdminLoginPage) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      if (isAuth) {
        // Check if user is an admin
        if (token.role !== "admin" && !isAdminLoginPage) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        // Redirect admin from login page if already authenticated
        if (isAdminLoginPage) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      }
    }

    // Handle auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // If trying to access admin routes without a token, redirect to login
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If trying to access login page with a token, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 