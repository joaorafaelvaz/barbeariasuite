import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const { searchParams } = req.nextUrl
  const type = searchParams.get("type") // receivable | payable
  const status = searchParams.get("status")

  const data = await prisma.totaliaFinancialAccount.findMany({
    where: {
      unitId,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
    },
    include: { category: { select: { id: true, name: true, color: true } } },
    orderBy: { dueDate: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaFinancialAccount.create({
    data: {
      unitId,
      type: body.type,
      amount: body.amount,
      description: body.description,
      categoryId: body.category_id,
      dueDate: body.due_date ? new Date(body.due_date) : null,
      status: body.status ?? "pendente",
      paymentDate: body.payment_date ? new Date(body.payment_date) : null,
      recurringRule: body.recurring_rule,
      tags: body.tags ?? [],
    },
  })
  return apiOk(data, 201)
})
