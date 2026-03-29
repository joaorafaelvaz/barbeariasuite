import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaProblem.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      origin: body.origin,
      probability: body.probability,
      impact: body.impact,
      status: body.status,
      assignedTo: body.assigned_to,
      resolvedAt: body.resolved_at ? new Date(body.resolved_at) : undefined,
      resolutionNotes: body.resolution_notes,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaProblem.delete({ where: { id } })
  return apiOk({ success: true })
})
