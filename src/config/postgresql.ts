import { DbConfig } from '../types'

export const getPostgresqlConfig = (): DbConfig => {
  const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env
  if (!POSTGRES_HOST || !POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB) {
    throw new Error('Missing POSTGRES envs.')
  }
  return {
    type: 'postgres',
    host: POSTGRES_HOST,
    port: 5432,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  }
}
