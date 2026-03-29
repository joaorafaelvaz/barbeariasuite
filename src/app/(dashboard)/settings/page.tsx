import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Administrador",
  FRANQUEADOR: "Franqueador",
  MULTIFRANQUEADO: "Multifranqueado",
  GERENTE: "Gerente",
  COLABORADOR: "Colaborador",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Minha Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas informacoes pessoais
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Suas informacoes de conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">Nome</p>
            <p>{session?.user.name}</p>
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{session?.user.email}</p>
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">
              Funcao
            </p>
            <Badge variant="secondary" className="w-fit">
              {roleLabels[session?.user.role || ""] || session?.user.role}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
