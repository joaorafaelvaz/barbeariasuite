"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { useFetch, apiPost, apiPut, apiDelete } from "./use-fetch"

// ---- Colaboradores ----

export function useColaboradores() {
  const { data: colaboradores, loading, refetch } = useFetch<any[]>("/api/totalia/colaboradores")

  const addColaborador = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/colaboradores", body)
    toast.success("Colaborador adicionado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateColaborador = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/colaboradores/${id}`, body)
    toast.success("Colaborador atualizado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const deleteColaborador = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/colaboradores/${id}`)
    toast.success("Colaborador removido com sucesso.")
    refetch()
  }, [refetch])

  return { colaboradores: colaboradores ?? [], loading, addColaborador, updateColaborador, deleteColaborador, refetch }
}

// ---- Cargos ----

export function useCargos() {
  const { data: cargos, loading, refetch } = useFetch<any[]>("/api/totalia/cargos")

  const addCargo = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/cargos", body)
    toast.success("Cargo criado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateCargo = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/cargos/${id}`, body)
    toast.success("Cargo atualizado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const deleteCargo = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/cargos/${id}`)
    toast.success("Cargo removido com sucesso.")
    refetch()
  }, [refetch])

  return { cargos: cargos ?? [], loading, addCargo, updateCargo, deleteCargo, refetch }
}

// ---- Tasks ----

export function useTasks(statusFilter?: string) {
  const url = statusFilter
    ? `/api/totalia/tasks?status=${encodeURIComponent(statusFilter)}`
    : "/api/totalia/tasks"
  const { data: tasks, loading, refetch } = useFetch<any[]>(url)

  const createTask = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/tasks", body)
    toast.success("Tarefa criada com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateTask = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/tasks/${id}`, body)
    toast.success("Tarefa atualizada com sucesso.")
    refetch()
    return data
  }, [refetch])

  const deleteTask = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/tasks/${id}`)
    toast.success("Tarefa removida com sucesso.")
    refetch()
  }, [refetch])

  return { tasks: tasks ?? [], loading, createTask, updateTask, deleteTask, refetch }
}

// ---- Processes ----

export function useProcesses() {
  const { data: processes, loading, refetch } = useFetch<any[]>("/api/totalia/processes")

  const createProcess = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/processes", body)
    toast.success("Processo criado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateProcess = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/processes/${id}`, body)
    toast.success("Processo atualizado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const deleteProcess = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/processes/${id}`)
    toast.success("Processo removido com sucesso.")
    refetch()
  }, [refetch])

  return { processes: processes ?? [], loading, createProcess, updateProcess, deleteProcess, refetch }
}

// ---- Strategic Planning ----

export function useStrategicPlanning() {
  const { data: strategicPlanning, loading, refetch } = useFetch<any>("/api/totalia/strategic-planning")

  const saveStrategicPlanning = useCallback(async (body: any) => {
    const data = await apiPut("/api/totalia/strategic-planning", body)
    toast.success("Planejamento estratégico salvo.")
    refetch()
    return data
  }, [refetch])

  return { strategicPlanning, loading, saveStrategicPlanning, refetch }
}

// ---- Financial Accounts ----

export function useFinancialAccounts(type?: "receivable" | "payable", status?: string) {
  const params = new URLSearchParams()
  if (type) params.set("type", type)
  if (status) params.set("status", status)
  const url = `/api/totalia/financial/accounts?${params}`

  const { data: accounts, loading, refetch } = useFetch<any[]>(url)

  const createAccount = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/financial/accounts", body)
    toast.success("Lançamento criado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateAccount = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/financial/accounts/${id}`, body)
    toast.success("Lançamento atualizado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const deleteAccount = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/financial/accounts/${id}`)
    toast.success("Lançamento removido com sucesso.")
    refetch()
  }, [refetch])

  return { accounts: accounts ?? [], loading, createAccount, updateAccount, deleteAccount, refetch }
}

// ---- Financial Categories ----

export function useFinancialCategories(type?: string) {
  const url = type
    ? `/api/totalia/financial/categories?type=${type}`
    : "/api/totalia/financial/categories"
  const { data: categories, loading, refetch } = useFetch<any[]>(url)

  const createCategory = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/financial/categories", body)
    toast.success("Categoria criada com sucesso.")
    refetch()
    return data
  }, [refetch])

  const deleteCategory = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/financial/categories/${id}`)
    toast.success("Categoria removida.")
    refetch()
  }, [refetch])

  return { categories: categories ?? [], loading, createCategory, deleteCategory, refetch }
}

// ---- Financial Stats ----

export function useFinancialStats(year?: number, month?: number) {
  const params = new URLSearchParams()
  if (year) params.set("year", String(year))
  if (month) params.set("month", String(month))
  const { data: stats, loading, refetch } = useFetch<any>(`/api/totalia/financial/stats?${params}`)
  return { stats, loading, refetch }
}

// ---- Risks ----

export function useRisks() {
  const { data: risks, loading, refetch } = useFetch<any[]>("/api/totalia/risks")

  const createRisk = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/risks", body)
    toast.success("Risco registrado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateRisk = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/risks/${id}`, body)
    toast.success("Risco atualizado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const deleteRisk = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/risks/${id}`)
    toast.success("Risco removido.")
    refetch()
  }, [refetch])

  return { risks: risks ?? [], loading, createRisk, updateRisk, deleteRisk, refetch }
}

// ---- Opportunities ----

export function useOpportunities() {
  const { data: opportunities, loading, refetch } = useFetch<any[]>("/api/totalia/opportunities")

  const createOpportunity = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/opportunities", body)
    toast.success("Oportunidade registrada com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateOpportunity = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/opportunities/${id}`, body)
    toast.success("Oportunidade atualizada.")
    refetch()
    return data
  }, [refetch])

  const deleteOpportunity = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/opportunities/${id}`)
    toast.success("Oportunidade removida.")
    refetch()
  }, [refetch])

  return { opportunities: opportunities ?? [], loading, createOpportunity, updateOpportunity, deleteOpportunity, refetch }
}

// ---- Problems ----

export function useProblems() {
  const { data: problems, loading, refetch } = useFetch<any[]>("/api/totalia/problems")

  const createProblem = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/problems", body)
    toast.success("Problema registrado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateProblem = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/problems/${id}`, body)
    toast.success("Problema atualizado.")
    refetch()
    return data
  }, [refetch])

  const deleteProblem = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/problems/${id}`)
    toast.success("Problema removido.")
    refetch()
  }, [refetch])

  return { problems: problems ?? [], loading, createProblem, updateProblem, deleteProblem, refetch }
}

// ---- Marketing Campaigns ----

export function useMarketingCampaigns() {
  const { data: campaigns, loading, refetch } = useFetch<any[]>("/api/totalia/marketing")

  const createCampaign = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/marketing", body)
    toast.success("Campanha criada com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateCampaign = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/marketing/${id}`, body)
    toast.success("Campanha atualizada.")
    refetch()
    return data
  }, [refetch])

  const deleteCampaign = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/marketing/${id}`)
    toast.success("Campanha removida.")
    refetch()
  }, [refetch])

  return { campaigns: campaigns ?? [], loading, createCampaign, updateCampaign, deleteCampaign, refetch }
}

// ---- Meetings ----

export function useMeetings() {
  const { data: meetings, loading, refetch } = useFetch<any[]>("/api/totalia/meetings")

  const createMeeting = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/meetings", body)
    toast.success("Reunião agendada com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateMeeting = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/meetings/${id}`, body)
    toast.success("Reunião atualizada.")
    refetch()
    return data
  }, [refetch])

  const deleteMeeting = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/meetings/${id}`)
    toast.success("Reunião removida.")
    refetch()
  }, [refetch])

  return { meetings: meetings ?? [], loading, createMeeting, updateMeeting, deleteMeeting, refetch }
}

// ---- Suppliers ----

export function useSuppliers() {
  const { data: suppliers, loading, refetch } = useFetch<any[]>("/api/totalia/suppliers")

  const createSupplier = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/suppliers", body)
    toast.success("Fornecedor criado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateSupplier = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/suppliers/${id}`, body)
    toast.success("Fornecedor atualizado.")
    refetch()
    return data
  }, [refetch])

  return { suppliers: suppliers ?? [], loading, createSupplier, updateSupplier, refetch }
}

// ---- Products ----

export function useProducts() {
  const { data: products, loading, refetch } = useFetch<any[]>("/api/totalia/products")

  const createProduct = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/products", body)
    toast.success("Produto criado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateProduct = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/products/${id}`, body)
    toast.success("Produto atualizado.")
    refetch()
    return data
  }, [refetch])

  return { products: products ?? [], loading, createProduct, updateProduct, refetch }
}

// ---- Purchase Orders ----

export function usePurchaseOrders() {
  const { data: orders, loading, refetch } = useFetch<any[]>("/api/totalia/purchase-orders")

  const createOrder = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/purchase-orders", body)
    toast.success("Pedido de compra criado com sucesso.")
    refetch()
    return data
  }, [refetch])

  const updateOrder = useCallback(async (id: string, body: any) => {
    const data = await apiPut(`/api/totalia/purchase-orders/${id}`, body)
    toast.success("Pedido atualizado.")
    refetch()
    return data
  }, [refetch])

  return { orders: orders ?? [], loading, createOrder, updateOrder, refetch }
}

// ---- Advisor ----

export function useAdvisorConversations() {
  const { data: conversations, loading, refetch } = useFetch<any[]>("/api/totalia/advisor/conversations")

  const createConversation = useCallback(async (body: any) => {
    const data = await apiPost("/api/totalia/advisor/conversations", body)
    refetch()
    return data
  }, [refetch])

  const updateConversation = useCallback(async (id: string, body: any) => {
    return apiPut(`/api/totalia/advisor/conversations/${id}`, body)
  }, [])

  const deleteConversation = useCallback(async (id: string) => {
    await apiDelete(`/api/totalia/advisor/conversations/${id}`)
    refetch()
  }, [refetch])

  return { conversations: conversations ?? [], loading, createConversation, updateConversation, deleteConversation, refetch }
}
