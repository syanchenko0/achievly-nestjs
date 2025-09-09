import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1757445901630 implements MigrationInterface {
    name = 'InitialMigration1757445901630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_74da8f612921485e1005dc8e225"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_acac37d02fe2970d73beb50bc40"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_7eda8521326c51e5ce790ddc653"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa"`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_74da8f612921485e1005dc8e225" FOREIGN KEY ("teamId") REFERENCES "team_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_acac37d02fe2970d73beb50bc40" FOREIGN KEY ("teamId") REFERENCES "team_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_7eda8521326c51e5ce790ddc653" FOREIGN KEY ("parentTaskId") REFERENCES "project_parent_task"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_7eda8521326c51e5ce790ddc653"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_acac37d02fe2970d73beb50bc40"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_74da8f612921485e1005dc8e225"`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_7eda8521326c51e5ce790ddc653" FOREIGN KEY ("parentTaskId") REFERENCES "project_parent_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_acac37d02fe2970d73beb50bc40" FOREIGN KEY ("teamId") REFERENCES "team_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_74da8f612921485e1005dc8e225" FOREIGN KEY ("teamId") REFERENCES "team_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
