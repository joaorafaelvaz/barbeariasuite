import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const { searchParams } = req.nextUrl
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()))
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1))

  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)

  const [receivable, payable] = await Promise.all([
    prisma.totaliaFinancialAccount.aggregate({
      where: { unitId, type: "receivable", dueDate: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.totaliaFinancialAccount.aggregate({
      where: { unitId, type: "payable", dueDate: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
  ])

  const totalReceivable = receivable._sum.amount ?? 0
  const totalPayable = payable._sum.amount ?? 0

  return apiOk({
    total_receivable: totalReceivable,
    total_payable: totalPayable,
    balance: totalReceivable - totalPayable,
    year,
    month,
  })
})
