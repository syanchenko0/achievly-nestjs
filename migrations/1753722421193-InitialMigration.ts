import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1753722421193 implements MigrationInterface {
    name = 'InitialMigration1753722421193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "income_items"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "expense_items"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "planned" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP CONSTRAINT "UQ_4deacff4e2ecbfad8816d812a95"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD CONSTRAINT "UQ_4deacff4e2ecbfad8816d812a95" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "planned"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "expense_items" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "income_items" jsonb NOT NULL DEFAULT '[]'`);
    }

}
