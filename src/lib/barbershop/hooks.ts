"use client"

import { useCallback } from "react"
import { useFetch, apiPost, apiPut, apiDelete } from "@/lib/totalia/use-fetch"
import { toast } from "sonner"

export function useColaboradoresBarbershop() {
  const { data, loading, refetch } = useFetch<any[]>("/api/barbershop/colaboradores")
  const colaboradores = data ?? []

  const createColaborador = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/barbershop/colaboradores", body)
      toast.success("Colaborador adicionado.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateColaborador = useCallback(
    async (id: string, body: any) => {
      const result = await apiPut(`/api/barbershop/colaboradores/${id}`, body)
      toast.success("Colaborador atualizado.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteColaborador = useCallback(
    async (id: string) => {
      await apiDelete(`/api/barbershop/colaboradores/${id}`)
      toast.success("Colaborador removido.")
      refetch()
    },
    [refetch]
  )

  return { colaboradores, loading, createColaborador, updateColaborador, deleteColaborador }
}

export function useClientesBarbershop(params?: { status?: string; q?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set("status", params.status)
  if (params?.q) qs.set("q", params.q)
  const url = `/api/barbershop/clientes${qs.toString() ? "?" + qs : ""}`

  const { data, loading, refetch } = useFetch<any[]>(url)
  const clientes = data ?? []

  const createCliente = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/barbershop/clientes", body)
      toast.success("Cliente adicionado.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateCliente = useCallback(
    async (id: string, body: any) => {
      const result = await apiPut(`/api/barbershop/clientes/${id}`, body)
      toast.success("Cliente atualizado.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteCliente = useCallback(
    async (id: string) => {
      await apiDelete(`/api/barbershop/clientes/${id}`)
      toast.success("Cliente removido.")
      refetch()
    },
    [refetch]
  )

  return { clientes, loading, createCliente, updateCliente, deleteCliente, refetch }
}

export function useVendasBarbershop(params?: {
  colaboradorId?: string
  clienteId?: string
  dataInicio?: string
  dataFim?: string
}) {
  const qs = new URLSearchParams()
  if (params?.colaboradorId) qs.set("colaboradorId", params.colaboradorId)
  if (params?.clienteId) qs.set("clienteId", params.clienteId)
  if (params?.dataInicio) qs.set("dataInicio", params.dataInicio)
  if (params?.dataFim) qs.set("dataFim", params.dataFim)
  const url = `/api/barbershop/vendas${qs.toString() ? "?" + qs : ""}`

  const { data, loading, refetch } = useFetch<any[]>(url)
  const vendas = data ?? []

  const createVenda = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/barbershop/vendas", body)
      toast.success("Venda registrada.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteVenda = useCallback(
    async (id: string) => {
      await apiDelete(`/api/barbershop/vendas/${id}`)
      toast.success("Venda removida.")
      refetch()
    },
    [refetch]
  )

  return { vendas, loading, createVenda, deleteVenda, refetch }
}

export function useMetasBarbershop(mes?: number, ano?: number) {
  const qs = new URLSearchParams()
  if (mes) qs.set("mes", String(mes))
  if (ano) qs.set("ano", String(ano))
  const url = `/api/barbershop/metas${qs.toString() ? "?" + qs : ""}`

  const { data, loading, refetch } = useFetch<any[]>(url)
  const metas = data ?? []

  const createMeta = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/barbershop/metas", body)
      toast.success("Meta criada.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateMeta = useCallback(
    async (id: string, body: any) => {
      const result = await apiPut(`/api/barbershop/metas/${id}`, body)
      toast.success("Meta atualizada.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteMeta = useCallback(
    async (id: string) => {
      await apiDelete(`/api/barbershop/metas/${id}`)
      toast.success("Meta removida.")
      refetch()
    },
    [refetch]
  )

  return { metas, loading, createMeta, updateMeta, deleteMeta }
}

export function useComissoesBarbershop(mes?: number, ano?: number) {
  const qs = new URLSearchParams()
  if (mes) qs.set("mes", String(mes))
  if (ano) qs.set("ano", String(ano))
  const url = `/api/barbershop/comissoes${qs.toString() ? "?" + qs : ""}`

  const { data, loading, refetch } = useFetch<any[]>(url)
  const comissoes = data ?? []

  const createComissao = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/barbershop/comissoes", body)
      toast.success("Regra de comissão criada.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateComissao = useCallback(
    async (id: string, body: any) => {
      const result = await apiPut(`/api/barbershop/comissoes/${id}`, body)
      toast.success("Regra atualizada.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteComissao = useCallback(
    async (id: string) => {
      await apiDelete(`/api/barbershop/comissoes/${id}`)
      toast.success("Regra removida.")
      refetch()
    },
    [refetch]
  )

  return { comissoes, loading, createComissao, updateComissao, deleteComissao }
}

export function useDashboardBarbershop(mes?: number, ano?: number) {
  const qs = new URLSearchParams()
  if (mes) qs.set("mes", String(mes))
  if (ano) qs.set("ano", String(ano))
  const url = `/api/barbershop/dashboard${qs.toString() ? "?" + qs : ""}`
  return useFetch<any>(url)
}
