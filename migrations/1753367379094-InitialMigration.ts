import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1753367379094 implements MigrationInterface {
    name = 'InitialMigration1753367379094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD CONSTRAINT "UQ_4deacff4e2ecbfad8816d812a95" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP CONSTRAINT "UQ_4deacff4e2ecbfad8816d812a95"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "userId"`);
    }

}
