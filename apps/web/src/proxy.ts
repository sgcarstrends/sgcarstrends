import { DOMAIN_NAME } from "@web/config";
import { type NextRequest, NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  // TODO: Temporary method for now
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  if (
    isMaintenanceMode &&
    !request.nextUrl.pathname.startsWith("/maintenance")
  ) {
    const maintenanceUrl = new URL("/maintenance", request.url);
    maintenanceUrl.searchParams.set("from", request.url);
    return NextResponse.redirect(maintenanceUrl);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.${DOMAIN_NAME} *.googletagmanager.com; 
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      connect-src *;
      font-src 'self';
  `;

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
    headers: requestHeaders,
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
