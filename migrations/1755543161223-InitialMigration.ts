import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1755543161223 implements MigrationInterface {
    name = 'InitialMigration1755543161223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task" RENAME COLUMN "is_parent" TO "parentTaskId"`);
        await queryRunner.query(`CREATE TABLE "project_parent_task" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "author" jsonb NOT NULL, "deadline_date" text, "done_date" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "PK_5554b98275f80d98dbef8f86651" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "parentTaskId"`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD "parentTaskId" integer`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_7eda8521326c51e5ce790ddc653" FOREIGN KEY ("parentTaskId") REFERENCES "project_parent_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_parent_task" ADD CONSTRAINT "FK_48d6248083c35da42afa34734dd" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_parent_task" DROP CONSTRAINT "FK_48d6248083c35da42afa34734dd"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_7eda8521326c51e5ce790ddc653"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "parentTaskId"`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD "parentTaskId" boolean`);
        await queryRunner.query(`DROP TABLE "project_parent_task"`);
        await queryRunner.query(`ALTER TABLE "project_task" RENAME COLUMN "parentTaskId" TO "is_parent"`);
    }

}
