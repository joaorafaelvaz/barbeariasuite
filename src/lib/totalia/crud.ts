import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getSelectedUnitId } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"

/** Returns the authenticated unit ID or throws a 401/400 Response */
export async function requireUnitId(): Promise<string> {
  const session = await getServerSession(authOptions)
  if (!session) throw new Response("Unauthorized", { status: 401 })
  const unitId = await getSelectedUnitId()
  if (!unitId) throw new Response("No unit selected", { status: 400 })
  return unitId
}

/** Standard JSON error response */
export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

/** Standard JSON success response */
export function apiOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

/** Wraps a route handler with error handling */
export function handle(
  fn: (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
    try {
      return await fn(req, ctx)
    } catch (err) {
      if (err instanceof Response) return err
      console.error(err)
      return apiError("Internal server error")
    }
  }
}
