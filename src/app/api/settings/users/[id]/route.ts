import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const allowed = ["SUPER_ADMIN", "FRANQUEADOR", "GERENTE"]
  if (!allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await ctx.params
  const { name, role } = await request.json()

  // Apenas SUPER_ADMIN pode promover para SUPER_ADMIN ou FRANQUEADOR
  if (["SUPER_ADMIN", "FRANQUEADOR"].includes(role) && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Sem permissão para atribuir este papel" }, { status: 403 })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { name, role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function DELETE(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const allowed = ["SUPER_ADMIN", "FRANQUEADOR"]
  if (!allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await ctx.params

  // Não pode deletar a si mesmo
  if (id === session.user.id) {
    return NextResponse.json({ error: "Não é possível excluir sua própria conta" }, { status: 400 })
  }

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
