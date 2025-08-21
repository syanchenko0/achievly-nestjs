import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1755532465293 implements MigrationInterface {
    name = 'InitialMigration1755532465293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task" ADD "is_parent" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "is_parent"`);
    }

}
