import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check for the session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      // Redirect unauthenticated users to the sign-in page
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Prevent logged-in users from accessing auth pages
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/signup"
  ],
};
