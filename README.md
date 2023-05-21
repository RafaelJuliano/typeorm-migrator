# TypeORM Migrator

The TypeORM Migrator is a tool to simplify the database migration process using TypeORM. With this tool, you can easily manage your migrations and execute migration-related commands.

## Setup

1. Make sure you have Node.js installed on your system.
2. Clone this repository: `git clone https://github.com/RafaelJuliano/typeorm-migrator.git`
3. Navigate to the project directory: `cd typeorm-migrator`
4. Install project dependencies: `npm install`

## Available Commands

### `npm run migrate -- [command] -f [folder]`

Executes a specific command related to database migrations.

#### Command options:

- `up`: Executes all pending migrations that have not been executed in the database.
- `down`: Reverts all executed migration in the database.
- `downLast`: Reverts the last executed migration in the database.
- `status`: Displays the current status of migrations in the database.

#### Migration Folder options:

- `-f [folder]`: Specifies the folder of migrations to be used.

Example: `npm run migrate -- up -f database1`

## Database Configuration

Make sure to configure the necessary environment variables for connecting to your database in the `.env` file. You can refer to the example `.env.example` file for the required variables.

Additionally, if you're using Docker Compose, ensure that your existing `docker-compose.yaml` file includes the necessary configuration for your database. You may need to set the environment variables for the database container, such as `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, etc.

### Creating the Database

After starting the database container, you will need to create the database manually if it doesn't exist. You can use a database administration tool like pgAdmin or connect to the database container and run the necessary SQL command to create the database.

## Contributing

Contributions are welcome! If you encounter any issues or have any suggestions for improvement, feel free to open an issue or submit a pull request.