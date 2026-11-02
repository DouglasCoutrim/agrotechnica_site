import mysql from "mysql2/promise";

const g = globalThis as unknown as { __pool?: mysql.Pool };

export const pool =
  g.__pool ??
  (g.__pool = mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    waitForConnections: true,
    connectionLimit: 4, // hospedagem compartilhada tem limite baixo de conexões
    dateStrings: true,
  }));

export async function q<T = Record<string, any>>(sql: string, params: unknown[] = []) {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

/** MariaDB devolve colunas JSON como texto. */
export function json<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v !== "string") return v as T;
  try { return JSON.parse(v) as T; } catch { return fallback; }
}
