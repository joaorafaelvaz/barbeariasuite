import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const { unitId } = await request.json()
  const cookieStore = await cookies()

  cookieStore.set("selected-unit-id", unitId || "all", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })

  return NextResponse.json({ ok: true })
}
