import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const auth_path =
    path === "/login" || path === "/register" || path === "/verify-mail";
  const is_private_path =
    path.startsWith("/api") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/members") ||
    path.startsWith("/leave");

  const token = request.cookies.get("token")?.value || "";
  if (auth_path && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.nextUrl).toString()
    );
  }
  if (is_private_path && !token && !path.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/login", request.nextUrl).toString());
  }
  if (path === "/" && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.nextUrl).toString()
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard",
    "/verify-mail",
    "/privacy-policy/:path",
    "/(api|trpc)(.*)",
    "/((?!.+\\.[\\w]+$|_next).*)",
  ],
};
