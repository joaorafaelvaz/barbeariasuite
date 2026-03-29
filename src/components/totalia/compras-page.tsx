"use client"

import { useState } from "react"
import { useSuppliers, useProducts, usePurchaseOrders } from "@/lib/totalia/hooks"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Building2 } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"

const supplierFields = [
  { key: "name", label: "Nome", required: true },
  { key: "cnpj_cpf", label: "CNPJ/CPF" },
  { key: "contact_person", label: "Contato" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Telefone" },
  { key: "status", label: "Status", type: "select" as const, options: ["ativo", "inativo"] },
]

const productFields = [
  { key: "name", label: "Nome", required: true },
  { key: "sku", label: "SKU" },
  { key: "category", label: "Categoria" },
  { key: "unit_of_measure", label: "Unidade" },
  { key: "unit_price", label: "Preço Unitário" },
  { key: "min_stock", label: "Estoque Mínimo" },
]

type Tab = "fornecedores" | "produtos" | "pedidos"

export default function ComprasPage() {
  const [tab, setTab] = useState<Tab>("fornecedores")
  const { suppliers, loading: ls, createSupplier, updateSupplier } = useSuppliers()
  const { products, loading: lp, createProduct, updateProduct } = useProducts()
  const { orders, loading: lo } = usePurchaseOrders()

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "fornecedores", label: "Fornecedores", icon: <Building2 className="h-4 w-4" /> },
    { key: "produtos", label: "Produtos", icon: <Package className="h-4 w-4" /> },
    { key: "pedidos", label: "Pedidos", icon: <ShoppingCart className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compras</h1>
        <p className="text-muted-foreground">Gestão de fornecedores, produtos e pedidos</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "outline"}
            onClick={() => setTab(t.key)}
            className="gap-2"
          >
            {t.icon}
            {t.label}
          </Button>
        ))}
      </div>

      {tab === "fornecedores" && (
        <SimpleListPage
          title="Fornecedores"
          description="Cadastro de fornecedores"
          icon={<Building2 className="h-5 w-5" />}
          items={suppliers}
          loading={ls}
          fields={supplierFields}
          onAdd={createSupplier}
          onUpdate={updateSupplier}
          onDelete={async () => {}}
          itemToForm={(s) => ({
            name: s.name,
            cnpj_cpf: s.cnpjCpf ?? "",
            contact_person: s.contactPerson ?? "",
            email: s.email ?? "",
            phone: s.phone ?? "",
            status: s.status,
          })}
          displayFields={(s) => (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{s.name}</p>
                <Badge variant={s.status === "ativo" ? "default" : "secondary"}>{s.status}</Badge>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                {s.cnpjCpf && <span>{s.cnpjCpf}</span>}
                {s.email && <span>{s.email}</span>}
                {s.phone && <span>{s.phone}</span>}
              </div>
            </div>
          )}
        />
      )}

      {tab === "produtos" && (
        <SimpleListPage
          title="Produtos"
          description="Catálogo de produtos"
          icon={<Package className="h-5 w-5" />}
          items={products}
          loading={lp}
          fields={productFields}
          onAdd={createProduct}
          onUpdate={updateProduct}
          onDelete={async () => {}}
          itemToForm={(p) => ({
            name: p.name,
            sku: p.sku ?? "",
            category: p.category ?? "",
            unit_of_measure: p.unitOfMeasure ?? "",
            unit_price: String(p.unitPrice),
            min_stock: String(p.minStock),
          })}
          displayFields={(p) => (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{p.name}</p>
                {p.sku && <Badge variant="outline">{p.sku}</Badge>}
                {p.category && <Badge variant="secondary">{p.category}</Badge>}
              </div>
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span>Estoque: {p.currentStock} {p.unitOfMeasure}</span>
                <span>Preço: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.unitPrice)}</span>
              </div>
            </div>
          )}
        />
      )}

      {tab === "pedidos" && (
        <div className="space-y-3">
          {lo ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            orders.map((o: any) => (
              <Card key={o.id}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pedido #{o.orderNumber}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        {o.supplier && <span>{o.supplier.name}</span>}
                        <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(o.finalAmount)}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{o.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {!lo && orders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum pedido cadastrado.</p>
          )}
        </div>
      )}
    </div>
  )
}
