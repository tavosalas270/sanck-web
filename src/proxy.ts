import { NextRequest, NextResponse } from 'next/server';

// Rutas que requieren autenticación (cualquier cosa debajo de /watch)
const PROTECTED_ROUTES = ['/watch'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verificar si existe al menos uno de los dos tokens
  const accessToken = request.cookies.get('access')?.value;
  const refreshToken = request.cookies.get('refresh')?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (!isAuthenticated) {
    // Redirigir al home (AuthScreen) si no hay tokens
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica el proxy a todas las rutas excepto archivos estáticos y APIs de Next.js
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
