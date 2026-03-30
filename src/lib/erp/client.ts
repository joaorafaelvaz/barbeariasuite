import { createPool, type Pool } from "mariadb"

let pool: Pool | null = null

export function getErpPool(): Pool {
  if (!pool) {
    const host = process.env.ERP_DB_HOST
    const port = parseInt(process.env.ERP_DB_PORT ?? "3306", 10)
    const user = process.env.ERP_DB_USER
    const password = process.env.ERP_DB_PASSWORD
    const database = process.env.ERP_DB_NAME ?? "franquia_producao"

    if (!host || !user || !password) {
      throw new Error(
        "Variáveis de ambiente ERP não configuradas: ERP_DB_HOST, ERP_DB_USER, ERP_DB_PASSWORD"
      )
    }

    pool = createPool({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 5,
      connectTimeout: 10000,
      acquireTimeout: 10000,
    })
  }
  return pool
}

export function isErpConfigured(): boolean {
  return !!(
    process.env.ERP_DB_HOST &&
    process.env.ERP_DB_USER &&
    process.env.ERP_DB_PASSWORD
  )
}

/** Executa uma query de leitura no ERP e retorna os resultados */
export async function erpQuery<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getErpPool()
  const conn = await pool.getConnection()
  try {
    const rows = await conn.query(sql, params)
    // mariadb retorna um array com meta no final — filtramos
    return Array.isArray(rows) ? (rows as T[]) : []
  } finally {
    conn.release()
  }
}
