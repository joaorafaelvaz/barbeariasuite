import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const { action, suggestedReply } = body

  const now = new Date()
  const updateData: any = {}

  if (action === "approve") {
    updateData.status = "approved"
    updateData.approvedAt = now
    if (suggestedReply) updateData.suggestedReply = suggestedReply
  } else if (action === "reject") {
    updateData.status = "rejected"
    updateData.rejectedAt = now
  } else {
    Object.assign(updateData, body)
  }

  await prisma.instagramApprovalQueue.updateMany({ where: { id, unitId }, data: updateData })
  return apiOk({ ok: true })
})
