import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaProcess.update({
    where: { id },
    data: {
      name: body.name,
      type: body.type,
      description: body.description,
      detailedDescription: body.detailed_description,
      status: body.status,
      activities: body.activities,
      area: body.area,
      objective: body.objective,
      kpis: body.kpis,
      checklists: body.checklists,
      implementationSteps: body.implementation_steps,
      requiredResources: body.required_resources,
      successMetrics: body.success_metrics,
      risks: body.risks,
      estimatedDuration: body.estimated_duration,
      responsibleRoles: body.responsible_roles,
      hasDetailedInfo: body.has_detailed_info,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaProcess.delete({ where: { id } })
  return apiOk({ success: true })
})
