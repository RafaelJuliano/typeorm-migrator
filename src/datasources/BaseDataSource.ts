import { resolve } from 'path'
import * as fs from 'fs'
import {
  DataSource,
  MigrationExecutor,
  DataSourceOptions,
  QueryRunner,
  MixedList,
  Migration,
} from 'typeorm'
import { DbConfig } from '../types'

export class BaseDataSource {
  private dataSource!: DataSource

  private queryRunner: QueryRunner

  private migrationExecutor!: MigrationExecutor

  constructor(
    private dbConfig: DbConfig,
    private migrationsPath: string,
  ) { }

  public async connect(): Promise<void> {
    try {
      console.log('Initializing DataSource')
      const migrations = this.getMigrationsClasses()
      this.dataSource = new DataSource({
        ...this.dbConfig,
        logging: true,
        migrations,
      })
      await this.dataSource.initialize()
      this.queryRunner = this.dataSource.createQueryRunner()
      this.migrationExecutor = new MigrationExecutor(this.dataSource, this.queryRunner)
      console.log('Initialized')
    } catch (error: any) {
      console.log(`Failed to initialize DataSource. ${error.message}`)
    }
  }

  public async close(): Promise<void> {
    await this.dataSource.destroy()
  }

  public async executeMigrations(): Promise<void> {
    const migrations = await this.migrationExecutor.executePendingMigrations()
    for (const migration of migrations) {
      console.log(`Migration ${migration.name} executed successfully.`)
    }
  }

  public async revertLastMigration(): Promise<void> {
    const [lastMigration] = await this.getExecutedMigrations()
    await this.migrationExecutor.undoLastMigration()
    console.log(`Migration ${lastMigration.name} revert successfully.`)
  }

  private async getExecutedMigrations(): Promise<Migration[]> {
    return this.migrationExecutor.getExecutedMigrations()
  }

  private getMigrationsClasses(): MixedList<Function> {
    console.log(`Getting migrations from ${this.migrationsPath}`)
    const rootMigrationsFolder = resolve(__dirname, '../migrations')
    const migrationsFolder = resolve(rootMigrationsFolder, this.migrationsPath)

    const migrationFiles = fs.readdirSync(migrationsFolder)

    const migrationsClasses = migrationFiles
      .filter(file => file.endsWith('.ts'))
      .map(file => require(resolve(migrationsFolder, file)).default)
      .filter(migration => typeof migration === 'function')
    console.log(`${migrationsClasses.length} found.`)
    return migrationsClasses
  }
}
