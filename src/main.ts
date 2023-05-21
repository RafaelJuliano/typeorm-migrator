import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { PostgresDataSource } from './datasources/PostgresDataSource'
import { getArgs } from './args'

dotenv.config()

async function main() {
  const { command, migrationFolder } = getArgs()

  const dataSource = new PostgresDataSource(migrationFolder)
  await dataSource.connect()

  switch (command) {
    case 'up':
      await dataSource.executeMigrations()
      break
    case 'downLast':
      await dataSource.revertLastMigration()
      break
    case 'down':
      await dataSource.revertAllMigrations()
      break
    case 'status':
      await dataSource.showStatus()
      break
    default:
      console.log('No valid command was provided')
      break
  }

  await dataSource.close()
}

main()
