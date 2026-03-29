import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json()

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nome, email e senha sao obrigatorios" },
      { status: 400 }
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Senha deve ter no minimo 6 caracteres" },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: "Este email ja esta cadastrado" },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "COLABORADOR",
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
