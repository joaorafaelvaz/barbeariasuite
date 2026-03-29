import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get("limit") ?? "50")

  const data = await prisma.totaliaAuditLog.findMany({
    where: { unitId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const session = await getServerSession(authOptions)
  const body = await req.json()

  const data = await prisma.totaliaAuditLog.create({
    data: {
      unitId,
      userId: session?.user?.id,
      tableName: body.table_name,
      action: body.action,
      details: body.details,
      ipAddress: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip"),
      userAgent: req.headers.get("user-agent"),
    },
  })
  return apiOk(data, 201)
})
