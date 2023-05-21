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
        logging: false,
        migrations,
      })
      await this.dataSource.initialize()
      this.queryRunner = this.dataSource.createQueryRunner()
      this.migrationExecutor = new MigrationExecutor(this.dataSource, this.queryRunner)
    } catch (error: any) {
      console.log(`Failed to initialize DataSource. ${error.message}`)
    }
  }

  public async close(): Promise<void> {
    await this.dataSource.destroy()
  }

  public async executeMigrations(): Promise<void> {
    const migrations = await this.migrationExecutor.executePendingMigrations()
    if (!migrations.length) {
      console.log('No pendding migrations.')
    }
    for (const migration of migrations) {
      console.log(`Migration ${migration.name} executed successfully.`)
    }
  }

  public async revertLastMigration(): Promise<void> {
    const [lastMigration] = await this.migrationExecutor.getExecutedMigrations()
    if (!lastMigration) {
      console.log('No executed migrations.')
      return
    }
    await this.migrationExecutor.undoLastMigration()
    console
      .log(`Migration ${lastMigration.name} reverted successfully.`)
  }

  public async revertAllMigrations(): Promise<void> {
    const migrations = await this.migrationExecutor.getExecutedMigrations()
    if (!migrations.length) {
      console.log('No executed migrations.')
      return
    }
    for (const migration of migrations) {
      await this.migrationExecutor.undoLastMigration()
      console.log(`Migration ${migration.name} reverted successfully.`)
    }
  }

  public async showStatus(): Promise<void> {
    const executedMigrations = await this.migrationExecutor.getExecutedMigrations()
    const pendingMigrations = await this.migrationExecutor.getPendingMigrations()

    const status = {
      'Executed Migrations': executedMigrations.map(m => m.name),
      'Pending Migrations': pendingMigrations.map(m => m.name)
    }

    const statusCount = {
      'Executed Migrations': executedMigrations.length,
      'Pending Migrations': pendingMigrations.length
    }

    console.table(statusCount)
    console.log(status)
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
