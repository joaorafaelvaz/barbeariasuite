import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.linkfoodIntegrationConfig.findMany({
    where: { unitId },
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.linkfoodIntegrationConfig.upsert({
    where: { unitId_platform: { unitId, platform: body.platform } },
    create: { unitId, ...body },
    update: body,
  })
  return apiOk(data)
})
