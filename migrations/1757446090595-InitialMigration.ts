import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1757446090595 implements MigrationInterface {
    name = 'InitialMigration1757446090595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_parent_task" DROP CONSTRAINT "FK_48d6248083c35da42afa34734dd"`);
        await queryRunner.query(`ALTER TABLE "project_parent_task" ADD CONSTRAINT "FK_48d6248083c35da42afa34734dd" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_parent_task" DROP CONSTRAINT "FK_48d6248083c35da42afa34734dd"`);
        await queryRunner.query(`ALTER TABLE "project_parent_task" ADD CONSTRAINT "FK_48d6248083c35da42afa34734dd" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
