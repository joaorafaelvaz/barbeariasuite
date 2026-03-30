"use client"

import { useFetch, apiPost, apiPut, apiDelete } from "@/lib/totalia/use-fetch"

// ── Dashboard ──────────────────────────────────────────────────────────────
export function useVipDataDashboard() {
  return useFetch<{
    faturamentoAtual: number
    faturamentoAnterior: number
    atendimentos: number
    ticketMedio: number
    colaboradores: number
    servicos: number
    folgasMes: number
    evolucao: { mes: string; total: number }[]
    ranking: { nome: string; total: number; atendimentos: number }[]
    syncLogs: VipDataSyncLog[]
  }>("/api/vip-data/dashboard")
}

// ── Types ──────────────────────────────────────────────────────────────────
export type VipDataServico = {
  id: string
  unitId: string
  nome: string
  categoria: string | null
  preco: number
  duracao: number | null
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export type VipDataFolga = {
  id: string
  unitId: string
  colaboradorId: string | null
  colaboradorNome: string | null
  tipo: string
  data: string
  motivo: string | null
  aprovada: boolean
  createdAt: string
}

export type VipDataFeriado = {
  id: string
  unitId: string
  nome: string
  data: string
  tipo: string
  recorrente: boolean
  createdAt: string
}

export type VipDataRelatorio = {
  id: string
  unitId: string
  semanaInicio: string
  semanaFim: string
  titulo: string | null
  conteudo: Record<string, unknown>
  criadoPor: string | null
  createdAt: string
}

export type VipDataSyncLog = {
  id: string
  unitId: string
  tipo: string
  status: string
  registrosSincronizados: number
  erros: number
  detalhes: unknown
  iniciadoEm: string
  finalizadoEm: string | null
}

// ── Serviços ───────────────────────────────────────────────────────────────
export function useVipDataServicos() {
  return useFetch<VipDataServico[]>("/api/vip-data/servicos")
}

export async function createServico(data: Partial<VipDataServico>) {
  return apiPost("/api/vip-data/servicos", data)
}

export async function updateServico(id: string, data: Partial<VipDataServico>) {
  return apiPut(`/api/vip-data/servicos/${id}`, data)
}

export async function deleteServico(id: string) {
  return apiDelete(`/api/vip-data/servicos/${id}`)
}

// ── Folgas ─────────────────────────────────────────────────────────────────
export function useVipDataFolgas(params: { ano?: number; mes?: number } = {}) {
  const query = new URLSearchParams()
  if (params.ano) query.set("ano", String(params.ano))
  if (params.mes) query.set("mes", String(params.mes))
  return useFetch<VipDataFolga[]>(`/api/vip-data/folgas?${query.toString()}`)
}

export async function createFolga(data: Partial<VipDataFolga>) {
  return apiPost("/api/vip-data/folgas", data)
}

export async function updateFolga(id: string, data: Partial<VipDataFolga>) {
  return apiPut(`/api/vip-data/folgas/${id}`, data)
}

export async function deleteFolga(id: string) {
  return apiDelete(`/api/vip-data/folgas/${id}`)
}

// ── Feriados ───────────────────────────────────────────────────────────────
export function useVipDataFeriados(ano?: number) {
  const query = ano ? `?ano=${ano}` : ""
  return useFetch<VipDataFeriado[]>(`/api/vip-data/feriados${query}`)
}

export async function createFeriado(data: Partial<VipDataFeriado>) {
  return apiPost("/api/vip-data/feriados", data)
}

export async function deleteFeriado(id: string) {
  return apiDelete(`/api/vip-data/feriados/${id}`)
}

// ── Relatórios ─────────────────────────────────────────────────────────────
export function useVipDataRelatorios(params: { take?: number; skip?: number } = {}) {
  const query = new URLSearchParams()
  if (params.take) query.set("take", String(params.take))
  if (params.skip) query.set("skip", String(params.skip))
  return useFetch<{ total: number; relatorios: VipDataRelatorio[] }>(
    `/api/vip-data/relatorios?${query.toString()}`
  )
}

export async function createRelatorio(data: Partial<VipDataRelatorio>) {
  return apiPost("/api/vip-data/relatorios", data)
}

export async function deleteRelatorio(id: string) {
  return apiDelete(`/api/vip-data/relatorios/${id}`)
}

// ── Sincronização ──────────────────────────────────────────────────────────
export function useVipDataSincronizacao(take = 20) {
  return useFetch<{
    logs: VipDataSyncLog[]
    ultimo: VipDataSyncLog | null
    totalSucesso: number
    totalErro: number
  }>(`/api/vip-data/sincronizacao?take=${take}`)
}

export async function triggerSync(tipo: string) {
  return apiPost("/api/vip-data/sincronizacao", { tipo })
}
