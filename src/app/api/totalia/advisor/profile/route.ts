import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaAdvisorProfile.findUnique({ where: { unitId } })
  return apiOk(data)
})

export const PUT = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaAdvisorProfile.upsert({
    where: { unitId },
    create: { unitId, name: body.name, profileData: body.profile_data },
    update: { name: body.name, profileData: body.profile_data },
  })
  return apiOk(data)
})
