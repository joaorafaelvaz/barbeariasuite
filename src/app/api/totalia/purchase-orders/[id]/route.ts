import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaPurchaseOrder.update({
    where: { id },
    data: {
      supplierId: body.supplier_id,
      requestedBy: body.requested_by,
      assignedTo: body.assigned_to,
      expectedDeliveryDate: body.expected_delivery_date ? new Date(body.expected_delivery_date) : undefined,
      deliveryDate: body.delivery_date ? new Date(body.delivery_date) : undefined,
      status: body.status,
      priority: body.priority,
      notes: body.notes,
      totalAmount: body.total_amount,
      discountAmount: body.discount_amount,
      taxAmount: body.tax_amount,
      finalAmount: body.final_amount,
      approvalNotes: body.approval_notes,
      cancellationReason: body.cancellation_reason,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaPurchaseOrder.delete({ where: { id } })
  return apiOk({ success: true })
})
