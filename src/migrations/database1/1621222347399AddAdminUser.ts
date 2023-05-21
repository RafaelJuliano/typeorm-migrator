import { MigrationInterface, QueryRunner } from 'typeorm'

export default class AddAdminUser1621222347399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO users (name, email) VALUES ('Admin', 'admin@example.com')",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM users WHERE email = 'admin@example.com'")
  }
}
