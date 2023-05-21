import { getPostgresqlConfig } from '../config/postgresql'
import { BaseDataSource } from './BaseDataSource'

export class PostgresDataSource extends BaseDataSource {
  constructor(migrationsPath: string) {
    super(getPostgresqlConfig(), migrationsPath)
  }
}
