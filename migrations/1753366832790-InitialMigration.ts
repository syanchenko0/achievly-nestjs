import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1753366832790 implements MigrationInterface {
    name = 'InitialMigration1753366832790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "budget_accounting" ("id" SERIAL NOT NULL, "income_items" jsonb NOT NULL DEFAULT '[]', "expense_items" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_e8a6856d4051f6e5afffab33d98" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "budget_accounting"`);
    }

}
