import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaProcess.findMany({
    where: { unitId },
    orderBy: { name: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaProcess.create({
    data: {
      unitId,
      name: body.name,
      type: body.type ?? "principal",
      description: body.description,
      detailedDescription: body.detailed_description,
      status: body.status ?? "ativo",
      activities: body.activities ?? [],
      area: body.area,
      objective: body.objective,
      kpis: body.kpis,
      checklists: body.checklists,
      implementationSteps: body.implementation_steps ?? [],
      requiredResources: body.required_resources ?? [],
      successMetrics: body.success_metrics ?? [],
      risks: body.risks ?? [],
      estimatedDuration: body.estimated_duration,
      responsibleRoles: body.responsible_roles ?? [],
    },
  })
  return apiOk(data, 201)
})
