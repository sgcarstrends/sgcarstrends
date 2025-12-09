import crypto from "node:crypto";
import { db, sessions } from "@sgcarstrends/database";
import { redis } from "@sgcarstrends/utils";
import { and, eq, gt } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

interface AppConfig {
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

export const proxy = async (request: NextRequest) => {
  // Check Redis for maintenance status
  const config = await redis.get<AppConfig>("config");
  const isMaintenanceMode = config?.maintenance?.enabled ?? false;
  const isOnMaintenancePage =
    request.nextUrl.pathname.startsWith("/maintenance");

  // Check for admin session bypass (via cross-subdomain cookie from admin.sgcarstrends.com)
  let hasAdminSession = false;
  if (isMaintenanceMode) {
    const sessionToken = request.cookies.get(
      "better-auth.session_token",
    )?.value;
    if (sessionToken) {
      const [session] = await db
        .select({ id: sessions.id })
        .from(sessions)
        .where(
          and(
            eq(sessions.token, sessionToken),
            gt(sessions.expiresAt, new Date()),
          ),
        )
        .limit(1);

      hasAdminSession = !!session;
    }
  }

  // Maintenance enabled, user NOT on maintenance page, NO admin session → redirect TO maintenance
  if (isMaintenanceMode && !isOnMaintenancePage && !hasAdminSession) {
    const maintenanceUrl = new URL("/maintenance", request.url);
    maintenanceUrl.searchParams.set("from", request.url);
    return NextResponse.redirect(maintenanceUrl);
  }

  // Maintenance disabled, user ON maintenance page → redirect AWAY from maintenance
  if (!isMaintenanceMode && isOnMaintenancePage) {
    const fromUrl = request.nextUrl.searchParams.get("from");
    const redirectUrl = fromUrl ? new URL(fromUrl) : new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const nonce = crypto.randomBytes(16).toString("base64");
  const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' *.sgcarstrends.com *.vercel-scripts.com vercel.live;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: *.unsplash.com;
      connect-src *;
      font-src 'self';
      frame-src 'self' vercel.live;
  `;
  // TODO: Use this CSP after migrating to Vercel
  // const cspHeader = `
  //     default-src 'self';
  //     script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  //     style-src 'self' 'unsafe-inline';
  //     img-src 'self' blob: data:;
  //     connect-src *;
  //     font-src 'self';
  //     frame-src 'self' 'strict-dynamic';
  // `;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  );

  requestHeaders.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim(),
  );

  requestHeaders.set("X-Robots-Tag", "all");

  return NextResponse.next({
    ...(!process.env.VERCEL && { headers: requestHeaders }),
    request: {
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
