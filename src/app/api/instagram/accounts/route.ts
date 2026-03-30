import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.instagramAccount.findMany({
    where: { unitId },
    include: {
      config: { select: { isActive: true, instagramUserId: true, onboardingCompleted: true } },
    },
    orderBy: { name: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const { name } = await req.json()
  const data = await prisma.instagramAccount.create({
    data: { unitId, name },
  })
  return apiOk(data, 201)
})
