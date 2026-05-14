// src\proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/merchants",
  "/webhooks",
  "/api-logs",
  "/filings",
  "/health",
  "/reports",
  "/analytics",
  "/billing",
  "/settings",
];

// Role-based access control
const roleRoutes: Record<string, string[]> = {
  admin: ["/dashboard", "/merchants", "/webhooks", "/api-logs", "/filings", "/health", "/reports", "/analytics", "/billing", "/settings"],
  merchant: ["/dashboard", "/reports", "/analytics", "/billing", "/settings"],
};

interface DecodedToken {
  userId?: string;
  email?: string;
  role?: string;
  merchantId?: string;
  exp?: number;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Allow public routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", encodeURI(pathname + request.nextUrl.search));

  // Redirect to login if token is not present
  if (!token) {
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("X-Redirect-Reason", "No Token");
    return response;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check token expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.error("Token expired");
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("X-Redirect-Reason", "Token Expired");
      return response;
    }

    const userRole = decoded.role || "merchant";

    // Role-based access control
    const allowedRoutes = roleRoutes[userRole] || roleRoutes.merchant;
    const isAllowed = allowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isAllowed) {
      console.error(`User role ${userRole} not allowed to access ${pathname}`);
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Add user info to headers for downstream use (optional)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("X-User-Id", decoded.userId || "");
    requestHeaders.set("X-User-Email", decoded.email || "");
    requestHeaders.set("X-User-Role", userRole);
    requestHeaders.set("X-Merchant-Id", decoded.merchantId || "");

    // Proceed to the requested route with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("X-Redirect-Reason", "Invalid Token");
    return response;
  }
}

// Matching Paths - protect all dashboard routes
export const config = {
  matcher: [
    // Dashboard routes
    "/dashboard",
    "/dashboard/:path*",
    "/merchants",
    "/merchants/:path*",
    "/webhooks",
    "/webhooks/:path*",
    "/api-logs",
    "/api-logs/:path*",
    "/filings",
    "/filings/:path*",
    "/health",
    "/health/:path*",
    "/reports",
    "/reports/:path*",
    "/analytics",
    "/analytics/:path*",
    "/billing",
    "/billing/:path*",
    "/settings",
    "/settings/:path*",
    // Auth routes
    "/login",
    "/register",
    "/forget-password",
    "/reset-password",
    "/verify-email",
  ],
};