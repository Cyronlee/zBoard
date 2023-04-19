import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { siteConfig } from '@/../config/site.config';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (!needSitePassword || isAuthenticated(request)) {
      return toHomePage(request);
    }
    return NextResponse.next();
  }
  if (!needSitePassword) {
    return NextResponse.next();
  }
  if (isAuthenticated(request)) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith('/api')) {
    return unauthorizedResponse;
  }
  return toLoginPage(request);
}

const needSitePassword = siteConfig.enableSitePassword && siteConfig.sitePassword;

const isAuthenticated = (request: NextRequest) => {
  const sitePassword = request.cookies.get('site_password')?.value;
  return sitePassword === siteConfig.sitePassword;
};

const toHomePage = (request: NextRequest) => {
  return NextResponse.redirect(new URL('/', request.url));
};

const toLoginPage = (request: NextRequest) => {
  return NextResponse.redirect(new URL('/login', request.url));
};

const unauthorizedResponse = new NextResponse(
  JSON.stringify({ success: false, message: 'authentication failed' }),
  {
    status: 401,
    headers: { 'content-type': 'application/json' },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
