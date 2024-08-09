import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log(new Date(), request.method, "=>", request.nextUrl.href);
  const path = request.nextUrl.pathname;
  const auth_path =
    path === "/login" || path === "/register" || path === "/verify-mail";
  const is_private_path =
    path.startsWith("/api") || 
    path.startsWith("/dashboard") || 
    path.startsWith("/members") || 
    path.startsWith("/leaves");
  const token = request.cookies.get("token")?.value || "";
  const is_bg_server = process.env.IS_BG_SERVER;

  if (is_bg_server == "true") {
    if (path.startsWith("/api")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `https://qtee.ai${path}`,
          request.nextUrl
        ).toString()
      );
    }
  } else {
    if (auth_path && token) {
      return NextResponse.redirect(
        new URL("/dashboard", request.nextUrl).toString()
      );
    }
    if (
      is_private_path &&
      !token &&
      !path.startsWith("/api/")
    ) {
      return NextResponse.redirect(
        new URL("/login", request.nextUrl).toString()
      );
    }
    if (path === "/" && token) {
      return NextResponse.redirect(
        new URL("/dashboard", request.nextUrl).toString()
      );
    }
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
