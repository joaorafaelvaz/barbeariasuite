import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const where = session.user.role === "SUPER_ADMIN"
    ? {}
    : { networkId: session.user.networkId ?? "__none__" }

  const units = await prisma.unit.findMany({
    where,
    include: { network: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(units)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const allowed = ["SUPER_ADMIN", "FRANQUEADOR"]
  if (!allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { name, slug, networkId, erpId } = body

  if (!name || !slug) {
    return NextResponse.json({ error: "name e slug são obrigatórios" }, { status: 400 })
  }

  // Resolver networkId: body → sessão → criar automaticamente para SUPER_ADMIN
  let resolvedNetworkId: string = networkId ?? session.user.networkId ?? ""

  if (!resolvedNetworkId) {
    if (session.user.role === "SUPER_ADMIN") {
      // Criar ou reutilizar rede padrão para SUPER_ADMIN sem rede
      const existing = await prisma.network.findFirst({ orderBy: { createdAt: "asc" } })
      if (existing) {
        resolvedNetworkId = existing.id
      } else {
        const network = await prisma.network.create({
          data: { name: "Rede Principal", slug: "rede-principal" },
        })
        resolvedNetworkId = network.id
        // Vincular o SUPER_ADMIN à nova rede
        await prisma.user.update({
          where: { id: session.user.id },
          data: { networkId: network.id },
        })
      }
    } else {
      return NextResponse.json({ error: "networkId necessário" }, { status: 400 })
    }
  }

  const unit = await prisma.unit.create({
    data: {
      name,
      slug,
      networkId: resolvedNetworkId,
      erpId: erpId ? Number(erpId) : null,
    },
    include: { network: { select: { id: true, name: true } } },
  })

  return NextResponse.json(unit, { status: 201 })
}
