import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get("accountId")
  const type = searchParams.get("type")
  const page = parseInt(searchParams.get("page") ?? "1")
  const limit = 50

  const where = {
    unitId,
    ...(accountId ? { accountId } : {}),
    ...(type ? { type } : {}),
  }

  const [logs, total] = await Promise.all([
    prisma.instagramActivityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.instagramActivityLog.count({ where }),
  ])

  return apiOk({ logs, total, page, limit })
})
