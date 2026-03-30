import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get("accountId")
  if (!accountId) {
    const all = await prisma.instagramConfig.findMany({ where: { unitId } })
    return apiOk(all)
  }
  const data = await prisma.instagramConfig.findUnique({ where: { accountId } })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const { accountId, ...rest } = body
  const data = await prisma.instagramConfig.upsert({
    where: { accountId },
    create: { unitId, accountId, ...rest },
    update: rest,
  })
  return apiOk(data)
})
