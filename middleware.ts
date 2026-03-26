import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("jwt_token")?.value;
    const isVerified =
      request.cookies.get("email_verified")?.value === "true";

    const { pathname } = request.nextUrl;

    // ✅ verified user
    if (token && isVerified) {
      if (
        pathname === "/signup" ||
        pathname === "/signup/action"
      ) {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        );
      }
    }

    // ✅ not verified
    if (token && isVerified === false) {
      if (pathname === "/dashboard") {
        return NextResponse.redirect(
          new URL("/signup?verify=true", request.url)
        );
      }
    }

    // ✅ not logged in
    if (!token) {
      if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/result") ||
        pathname.startsWith("/upload") ||
        pathname.startsWith("/user") ||
        pathname.startsWith("/folder") ||
        pathname === "/final" ||
        pathname === "/gallery" ||
        pathname === "/account" ||
        pathname === "/billing"
      ) {
        return NextResponse.redirect(
          new URL("/signup", request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL("/signup", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};