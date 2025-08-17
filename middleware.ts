// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    "/", 
    "/login", 
    "/register", 
    "/forgot-password", 
    "/terms", 
    "/privacy"
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for session token in cookies
  const sessionToken = req.cookies.get("better-auth.session_token");
  
  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If session token exists, allow access
  // Note: We're not validating the token here to avoid database calls in middleware
  // The actual validation will happen in your API routes/components
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};