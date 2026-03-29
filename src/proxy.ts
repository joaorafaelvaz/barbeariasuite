import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const publicPaths = ["/login", "/register", "/api/auth"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = publicPaths.some((path) => pathname.startsWith(path))
  if (isPublic) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
