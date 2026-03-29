import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaPurchaseOrder.findMany({
    where: { unitId },
    include: {
      supplier: { select: { id: true, name: true } },
      items: { include: { product: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const { items, ...orderData } = body

  const data = await prisma.totaliaPurchaseOrder.create({
    data: {
      unitId,
      orderNumber: orderData.order_number,
      supplierId: orderData.supplier_id,
      requestedBy: orderData.requested_by,
      assignedTo: orderData.assigned_to,
      requestDate: orderData.request_date ? new Date(orderData.request_date) : null,
      expectedDeliveryDate: orderData.expected_delivery_date ? new Date(orderData.expected_delivery_date) : null,
      status: orderData.status ?? "rascunho",
      priority: orderData.priority,
      notes: orderData.notes,
      totalAmount: orderData.total_amount ?? 0,
      discountAmount: orderData.discount_amount ?? 0,
      taxAmount: orderData.tax_amount ?? 0,
      finalAmount: orderData.final_amount ?? 0,
      items: items
        ? {
            create: items.map((item: any) => ({
              productId: item.product_id,
              quantity: item.quantity ?? 1,
              unitPrice: item.unit_price ?? 0,
              totalPrice: (item.quantity ?? 1) * (item.unit_price ?? 0),
              notes: item.notes,
            })),
          }
        : undefined,
    },
    include: { items: true },
  })
  return apiOk(data, 201)
})
