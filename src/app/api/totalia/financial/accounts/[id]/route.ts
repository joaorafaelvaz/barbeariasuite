import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaFinancialAccount.update({
    where: { id },
    data: {
      type: body.type,
      amount: body.amount,
      description: body.description,
      categoryId: body.category_id,
      dueDate: body.due_date ? new Date(body.due_date) : undefined,
      status: body.status,
      paymentDate: body.payment_date ? new Date(body.payment_date) : undefined,
      recurringRule: body.recurring_rule,
      tags: body.tags,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaFinancialAccount.delete({ where: { id } })
  return apiOk({ success: true })
})
