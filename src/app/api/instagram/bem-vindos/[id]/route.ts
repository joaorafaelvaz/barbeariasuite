import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const { status } = await req.json()
  await prisma.instagramWelcomeMessage.updateMany({
    where: { id, unitId },
    data: { status },
  })
  return apiOk({ ok: true })
})
