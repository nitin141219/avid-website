import jwt from "jsonwebtoken";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
// const protectedRoutes = ["/dashboard", "/profile", "/settings"];
// const authRoutes = ["/login", "/signup"];

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permanent SEO redirect: old AviGa HP URL -> new AviGa HP70 URL
  if (/^\/(en|de|fr|es)\/product\/alpha-hydroxy-acids\/aviga-hp\/?$/.test(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname.replace(/\/aviga-hp\/?$/, "/aviga-hp-70");
    return NextResponse.redirect(redirectUrl, 301);
  }

  // First let next-intl handle locale routing
  const intlResponse = intlMiddleware(request);

  // Extract locale-aware pathname
  const locale = pathname.split("/")[1];

  // Auth Routes (Not accessible if already logged in)
  const authRoutes = [`/${locale}/login`, `/${locale}/signup`, `/${locale}/reset-password`];

  // Routes that require authentication
  const protectedRoutes = [`/${locale}/admin`];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  // Public routes (no auth required)
  const token = request.cookies.get("token")?.value;

  // Verify token if exists
  let user: any = null;
  if (token) {
    try {
      const decoded: any = jwt.decode(token);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp > currentTime) {
          user = decoded;
        }
      }
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  if (isProtected && !(token && user)) {
    const res = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    res.headers.set("x-pathname", pathname);
    return res;
  }

  // Admin panel only accessible for admin users.
  if (isProtected && token && user && !user.is_admin) {
    const res = NextResponse.redirect(new URL(`/${locale}`, request.url));
    res.headers.set("x-pathname", pathname);
    return res;
  }

  if (isAuth && token && user) {
    const res = NextResponse.redirect(new URL(`/${locale}`, request.url));
    res.headers.set("x-pathname", pathname);
    return res;
  }

  if (pathname === `/${locale}/admin`) {
    return NextResponse.redirect(new URL(`/${locale}/admin/users`, request.url));
  }

  intlResponse.headers.set("x-pathname", pathname);
  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
