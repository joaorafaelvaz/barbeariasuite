import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isErpConfigured, erpQuery } from "@/lib/erp/client"
import { syncUnidade, syncUnidades, type SyncResult } from "@/lib/erp/sync"

// POST /api/erp/sync — dispara sincronização
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const allowed = ["SUPER_ADMIN", "FRANQUEADOR"]
  if (!allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (!isErpConfigured()) {
    return NextResponse.json(
      { error: "ERP não configurado. Adicione ERP_DB_HOST, ERP_DB_USER, ERP_DB_PASSWORD no .env" },
      { status: 503 }
    )
  }

  const body = await request.json()
  const {
    unitId,          // platform unit id (obrigatório, exceto para syncAll)
    syncAll,         // true = sincronizar todas as unidades pelo erpId
    networkId,       // necessário quando syncAll = true
    entidades,       // array: ["colaboradores","clientes","vendas","servicos","folgas"]
    dataInicio,      // ISO string (opcional, para filtro de vendas)
    dataFim,         // ISO string (opcional)
  } = body

  const logId = await iniciarLog(unitId ?? "all")

  try {
    type ResultEntry =
      | SyncResult
      | { unit: string; results: SyncResult[] }

    const resultados: ResultEntry[] = []

    if (syncAll && networkId) {
      const rUnidades = await syncUnidades(networkId)
      resultados.push(rUnidades)

      const units = await prisma.unit.findMany({
        where: { networkId, erpId: { not: null } },
        select: { id: true, erpId: true, name: true },
      })

      for (const unit of units) {
        const results = await syncUnidade(unit.id, unit.erpId!, {
          colaboradores: !entidades || entidades.includes("colaboradores"),
          clientes: !entidades || entidades.includes("clientes"),
          vendas: !entidades || entidades.includes("vendas"),
          servicos: !entidades || entidades.includes("servicos"),
          folgas: !entidades || entidades.includes("folgas"),
          dataInicio: dataInicio ? new Date(dataInicio) : undefined,
          dataFim: dataFim ? new Date(dataFim) : undefined,
        })
        resultados.push({ unit: unit.name, results })
      }
    } else if (unitId) {
      const unit = await prisma.unit.findUnique({ where: { id: unitId } })
      if (!unit?.erpId) {
        return NextResponse.json(
          { error: "Unidade não tem erpId configurado. Vincule pelo painel de Unidades." },
          { status: 400 }
        )
      }

      const results = await syncUnidade(unit.id, unit.erpId, {
        colaboradores: !entidades || entidades.includes("colaboradores"),
        clientes: !entidades || entidades.includes("clientes"),
        vendas: !entidades || entidades.includes("vendas"),
        servicos: !entidades || entidades.includes("servicos"),
        folgas: !entidades || entidades.includes("folgas"),
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim ? new Date(dataFim) : undefined,
      })
      resultados.push(...results)
    } else {
      return NextResponse.json(
        { error: "Informe unitId ou syncAll+networkId" },
        { status: 400 }
      )
    }

    function flattenResults(entries: ResultEntry[]): SyncResult[] {
      return entries.flatMap((r) => "results" in r ? r.results : [r])
    }

    const flat = flattenResults(resultados)
    const total = flat.reduce(
      (acc, r) => ({
        inserted: acc.inserted + (r.inserted ?? 0),
        updated: acc.updated + (r.updated ?? 0),
        errors: acc.errors + (r.errors ?? 0),
      }),
      { inserted: 0, updated: 0, errors: 0 }
    )

    await finalizarLog(logId, "success", total.inserted + total.updated, total.errors, resultados)

    return NextResponse.json({ ok: true, logId, total, resultados })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    await finalizarLog(logId, "error", 0, 1, [{ error: msg }])
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// GET /api/erp/sync — status e logs recentes
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const unitId = searchParams.get("unitId")

  const logs = await prisma.vipDataSyncLog.findMany({
    where: unitId ? { unitId } : {},
    orderBy: { iniciadoEm: "desc" },
    take: 20,
  })

  const configured = isErpConfigured()

  // Testar conexão se configurado
  let connectionOk = false
  let connectionError: string | null = null
  if (configured) {
    try {
      await erpQuery("SELECT 1")
      connectionOk = true
    } catch (err: unknown) {
      connectionError = err instanceof Error ? err.message : String(err)
    }
  }

  return NextResponse.json({ configured, connectionOk, connectionError, logs })
}

// ─── Helpers de log ──────────────────────────────────────────────────────────

async function iniciarLog(unitId: string) {
  const log = await prisma.vipDataSyncLog.create({
    data: { unitId, tipo: "manual", status: "running" },
  })
  return log.id
}

async function finalizarLog(
  id: string,
  status: "success" | "error",
  registros: number,
  erros: number,
  detalhes: unknown
) {
  await prisma.vipDataSyncLog.update({
    where: { id },
    data: {
      status,
      registrosSincronizados: registros,
      erros,
      detalhes: detalhes as never,
      finalizadoEm: new Date(),
    },
  })
}
