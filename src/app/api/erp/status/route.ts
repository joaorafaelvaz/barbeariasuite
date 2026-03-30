import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isErpConfigured, erpQuery, resetErpPool } from "@/lib/erp/client"

// POST /api/erp/status — força reset do pool (reconectar)
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  resetErpPool()

  // Testa nova conexão imediatamente
  if (!isErpConfigured()) {
    return NextResponse.json({ ok: false, message: "ERP não configurado" })
  }

  try {
    const rows = await erpQuery<{ versao: string }>("SELECT VERSION() AS versao")
    return NextResponse.json({ ok: true, connected: true, versao: rows[0]?.versao })
  } catch (err: unknown) {
    return NextResponse.json({
      ok: false,
      connected: false,
      message: err instanceof Error ? err.message : String(err),
    })
  }
}

// GET /api/erp/status — verifica conexão com ERP
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const configured = isErpConfigured()

  if (!configured) {
    return NextResponse.json({
      configured: false,
      connected: false,
      message: "ERP_DB_HOST, ERP_DB_USER e ERP_DB_PASSWORD não configurados",
    })
  }

  try {
    const rows = await erpQuery<{ versao: string }>(
      "SELECT VERSION() AS versao"
    )
    return NextResponse.json({
      configured: true,
      connected: true,
      versao: rows[0]?.versao ?? "desconhecida",
    })
  } catch (err: unknown) {
    return NextResponse.json({
      configured: true,
      connected: false,
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
