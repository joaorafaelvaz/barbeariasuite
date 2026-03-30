"use client"

import { useFetch, apiPost, apiPut, apiDelete } from "@/lib/totalia/use-fetch"

// ── Types ──────────────────────────────────────────────────────────────────
export type VipCamCamera = {
  id: string
  unitId: string
  nome: string
  localizacao: string | null
  rtspUrl: string | null
  isActive: boolean
  resolucao: string | null
  fpsTarget: number
  createdAt: string
  updatedAt: string
}

export type VipCamPessoa = {
  id: string
  unitId: string
  nomeExibicao: string | null
  tipoPessoa: string
  primeiraVista: string | null
  ultimaVista: string | null
  totalVisitas: number
  avgSatisfacao: number | null
  idadeEstimada: number | null
  generoEstimado: string | null
  thumbnailPath: string | null
  createdAt: string
}

export type VipCamSettings = {
  unitId: string
  faceThreshold: number
  yoloConfianca: number
  emaAlpha: number
  fpsTarget: number
  pipelineAtivo: boolean
  backendUrl: string | null
}

export type VipCamDashboard = {
  totalCameras: number
  camerasAtivas: number
  totalPessoas: number
  pessoasHoje: number
  clientes: number
  colaboradores: number
  avgSatisfacao: number | null
  avgOcupacao: number | null
  emocoesDominantes: { emocao: string | null; count: number }[]
  cameras: { id: string; nome: string; localizacao: string | null; isActive: boolean }[]
  pipelineAtivo: boolean
  backendUrl: string | null
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export function useVipCamDashboard() {
  return useFetch<VipCamDashboard>("/api/vipcam/dashboard")
}

// ── Cameras ────────────────────────────────────────────────────────────────
export function useVipCamCameras() {
  return useFetch<VipCamCamera[]>("/api/vipcam/cameras")
}

export async function createCamera(data: Partial<VipCamCamera>) {
  return apiPost("/api/vipcam/cameras", data)
}

export async function updateCamera(id: string, data: Partial<VipCamCamera>) {
  return apiPut(`/api/vipcam/cameras/${id}`, data)
}

export async function deleteCamera(id: string) {
  return apiDelete(`/api/vipcam/cameras/${id}`)
}

// ── Pessoas ────────────────────────────────────────────────────────────────
export function useVipCamPessoas(params: { tipo?: string; busca?: string; take?: number; skip?: number } = {}) {
  const q = new URLSearchParams()
  if (params.tipo) q.set("tipo", params.tipo)
  if (params.busca) q.set("busca", params.busca)
  if (params.take) q.set("take", String(params.take))
  if (params.skip) q.set("skip", String(params.skip))
  return useFetch<{ total: number; pessoas: VipCamPessoa[] }>(`/api/vipcam/pessoas?${q.toString()}`)
}

export async function updatePessoa(id: string, data: Partial<VipCamPessoa>) {
  return apiPut(`/api/vipcam/pessoas/${id}`, data)
}

export async function deletePessoa(id: string) {
  return apiDelete(`/api/vipcam/pessoas/${id}`)
}

// ── Emoções ────────────────────────────────────────────────────────────────
export function useVipCamEmocoes(params: { horas?: number; cameraId?: string } = {}) {
  const q = new URLSearchParams()
  if (params.horas) q.set("horas", String(params.horas))
  if (params.cameraId) q.set("cameraId", params.cameraId)
  return useFetch<{
    distribuicao: { emocao: string; count: number }[]
    resumo: { total: number; avgSatisfacao: number | null; avgValence: number | null; avgArousal: number | null }
  }>(`/api/vipcam/emocoes?${q.toString()}`)
}

// ── Settings ───────────────────────────────────────────────────────────────
export function useVipCamSettings() {
  return useFetch<VipCamSettings>("/api/vipcam/settings")
}

export async function saveSettings(data: Partial<VipCamSettings>) {
  return apiPut("/api/vipcam/settings", data)
}
