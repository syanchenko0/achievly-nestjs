import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1753729827470 implements MigrationInterface {
    name = 'InitialMigration1753729827470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD "variant" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP COLUMN "variant"`);
    }

}
