import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/features/auth/utils/constants";

export function middleware(request: NextRequest) {
  const hasSession = !!request.cookies.get(SESSION_COOKIE)?.value;

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/invitation/:path*"],
};
