import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaStrategicPlanning.findUnique({ where: { unitId } })
  return apiOk(data)
})

export const PUT = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaStrategicPlanning.upsert({
    where: { unitId },
    create: {
      unitId,
      mission: body.mission,
      vision: body.vision,
      values: body.values,
      swotStrengths: body.swot_strengths ?? [],
      swotWeaknesses: body.swot_weaknesses ?? [],
      swotOpportunities: body.swot_opportunities ?? [],
      swotThreats: body.swot_threats ?? [],
      objectives: body.objectives ?? [],
    },
    update: {
      mission: body.mission,
      vision: body.vision,
      values: body.values,
      swotStrengths: body.swot_strengths,
      swotWeaknesses: body.swot_weaknesses,
      swotOpportunities: body.swot_opportunities,
      swotThreats: body.swot_threats,
      objectives: body.objectives,
    },
  })
  return apiOk(data)
})
