import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from './lib/encrypt'

// tabel path
const protectedRoutes = [
  '/api/book', '/api/user', '/api/collection'
];
const publicRoutes = ['/api/login', '/api/register'];

export default async function middleware(req: NextRequest) {
  console.log("detecting path: ", req.url.split('?')[0])
  const Rawpath = req.url.split('?')[0];
  const path = Rawpath.replace(`${process.env.BASE_URL}`, '');

  const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/dashboard');
  const isPublicRoute = publicRoutes.includes(path);


  // ambil sesi
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  // login jika sesi tidak ada
  if (isProtectedRoute && (typeof (session) == 'undefined')) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    console.log("diarahkan ke /login;")
    return NextResponse.rewrite(url)
  }

  // redirect to dashboard jika user sudah login
  if (
    isPublicRoute &&
    session?.userId &&
    !req.url.startsWith('/dashboard')
  ) {
    console.log("kena ini")
    return NextResponse.redirect(new URL('/', req.url))
  }
  console.log("lolos")
  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|https?:\\/\\/).*)'],
}
