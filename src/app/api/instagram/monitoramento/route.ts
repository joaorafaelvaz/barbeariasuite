import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get("accountId")

  const data = await prisma.instagramWatchAccount.findMany({
    where: {
      unitId,
      ...(accountId ? { accountId } : {}),
    },
    orderBy: { addedAt: "desc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.instagramWatchAccount.create({
    data: { unitId, ...body },
  })
  return apiOk(data, 201)
})
