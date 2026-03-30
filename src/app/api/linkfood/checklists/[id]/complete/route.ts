import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const POST = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const session = await getServerSession(authOptions)
  const body = await req.json()
  const { itemIds, periodDate } = body

  const completions = await prisma.linkfoodChecklistCompletion.createMany({
    data: itemIds.map((itemId: string) => ({
      unitId,
      checklistId: id,
      checklistItemId: itemId,
      completedBy: session?.user?.name ?? "unknown",
      periodDate: periodDate ? new Date(periodDate) : null,
    })),
    skipDuplicates: true,
  })
  return apiOk(completions)
})
