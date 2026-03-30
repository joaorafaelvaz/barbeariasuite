import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get("accountId")
  const status = searchParams.get("status")

  const data = await prisma.instagramWelcomeMessage.findMany({
    where: {
      unitId,
      ...(accountId ? { accountId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
  return apiOk(data)
})
