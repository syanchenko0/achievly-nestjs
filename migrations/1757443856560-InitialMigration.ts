import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1757443856560 implements MigrationInterface {
    name = 'InitialMigration1757443856560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "goal_task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "deadline_date" character varying, "note" character varying, "done_date" character varying, "list_order" integer, "goal_list_order" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "goalId" integer, CONSTRAINT "PK_f839a62b05b5a593f990354a2b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."goal_entity_category_enum" AS ENUM('education', 'career', 'finance', 'health', 'sports', 'relationships', 'travel', 'creativity', 'business', 'personalGrowth', 'charity', 'hobby', 'spirituality', 'ecology', 'socialActivity')`);
        await queryRunner.query(`CREATE TYPE "public"."goal_entity_status_enum" AS ENUM('ongoing', 'achieved')`);
        await queryRunner.query(`CREATE TABLE "goal_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "category" "public"."goal_entity_category_enum" NOT NULL, "status" "public"."goal_entity_status_enum" NOT NULL DEFAULT 'ongoing', "deadline_date" character varying, "note" character varying, "list_order" integer, "achieved_date" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_e75c918bbcc0b9731ef5a1a759d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "start_timestamp" bigint NOT NULL, "end_timestamp" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_c5675e66b601bd4d0882054a430" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "accept" character varying, "reject" character varying, "userId" integer, CONSTRAINT "PK_112676de71a3a708b914daed289" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "columns" jsonb NOT NULL DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "teamId" integer, "userId" integer, CONSTRAINT "PK_7a75a94e01d0b50bff123db1b87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_task_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`);
        await queryRunner.query(`CREATE TABLE "project_task" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "column" jsonb NOT NULL, "author" jsonb NOT NULL, "executor" jsonb, "priority" "public"."project_task_priority_enum", "list_order" integer NOT NULL, "deadline_date" text, "done_date" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, "parentTaskId" integer, CONSTRAINT "PK_f8275249858f42bc01e47cb979d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_parent_task" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "author" jsonb NOT NULL, "deadline_date" text, "done_date" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "PK_5554b98275f80d98dbef8f86651" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "budget_accounting" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "value" integer NOT NULL, "date" TIMESTAMP NOT NULL, "planned" boolean NOT NULL, "variant" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_e8a6856d4051f6e5afffab33d98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "picture_url" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "join_access_token" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_729030db84428f430d098ee9f4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."team_member_role_enum" AS ENUM('owner', 'admin', 'member')`);
        await queryRunner.query(`CREATE TABLE "team_member" ("id" SERIAL NOT NULL, "user" jsonb NOT NULL, "role" "public"."team_member_role_enum" NOT NULL, "projects_rights" jsonb, "teamId" integer, CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_entity_users_user_entity" ("teamEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, CONSTRAINT "PK_0ae53b74ae56dcb4a721d45b41d" PRIMARY KEY ("teamEntityId", "userEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3c4b0151b7369d657f1122de2" ON "team_entity_users_user_entity" ("teamEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e4ed26f35c84c314a3718a7605" ON "team_entity_users_user_entity" ("userEntityId") `);
        await queryRunner.query(`ALTER TABLE "goal_task" ADD CONSTRAINT "FK_412a9c4aa4c8177b1a3293f7597" FOREIGN KEY ("goalId") REFERENCES "goal_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal_entity" ADD CONSTRAINT "FK_3b2a35fbbf7ae438d311a64aec7" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_entity" ADD CONSTRAINT "FK_a22a7f5a9d3c290651eb6d17540" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_entity" ADD CONSTRAINT "FK_dd9edd17abec9f32798a1f1e22d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_acac37d02fe2970d73beb50bc40" FOREIGN KEY ("teamId") REFERENCES "team_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_ea4982b0ce8cb41f951c0954cbd" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_7eda8521326c51e5ce790ddc653" FOREIGN KEY ("parentTaskId") REFERENCES "project_parent_task"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_parent_task" ADD CONSTRAINT "FK_48d6248083c35da42afa34734dd" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" ADD CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_74da8f612921485e1005dc8e225" FOREIGN KEY ("teamId") REFERENCES "team_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_entity_users_user_entity" ADD CONSTRAINT "FK_b3c4b0151b7369d657f1122de23" FOREIGN KEY ("teamEntityId") REFERENCES "team_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "team_entity_users_user_entity" ADD CONSTRAINT "FK_e4ed26f35c84c314a3718a76058" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_entity_users_user_entity" DROP CONSTRAINT "FK_e4ed26f35c84c314a3718a76058"`);
        await queryRunner.query(`ALTER TABLE "team_entity_users_user_entity" DROP CONSTRAINT "FK_b3c4b0151b7369d657f1122de23"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_74da8f612921485e1005dc8e225"`);
        await queryRunner.query(`ALTER TABLE "budget_accounting" DROP CONSTRAINT "FK_4deacff4e2ecbfad8816d812a95"`);
        await queryRunner.query(`ALTER TABLE "project_parent_task" DROP CONSTRAINT "FK_48d6248083c35da42afa34734dd"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_7eda8521326c51e5ce790ddc653"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_ea4982b0ce8cb41f951c0954cbd"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_acac37d02fe2970d73beb50bc40"`);
        await queryRunner.query(`ALTER TABLE "notification_entity" DROP CONSTRAINT "FK_dd9edd17abec9f32798a1f1e22d"`);
        await queryRunner.query(`ALTER TABLE "event_entity" DROP CONSTRAINT "FK_a22a7f5a9d3c290651eb6d17540"`);
        await queryRunner.query(`ALTER TABLE "goal_entity" DROP CONSTRAINT "FK_3b2a35fbbf7ae438d311a64aec7"`);
        await queryRunner.query(`ALTER TABLE "goal_task" DROP CONSTRAINT "FK_412a9c4aa4c8177b1a3293f7597"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4ed26f35c84c314a3718a7605"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3c4b0151b7369d657f1122de2"`);
        await queryRunner.query(`DROP TABLE "team_entity_users_user_entity"`);
        await queryRunner.query(`DROP TABLE "team_member"`);
        await queryRunner.query(`DROP TYPE "public"."team_member_role_enum"`);
        await queryRunner.query(`DROP TABLE "team_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "budget_accounting"`);
        await queryRunner.query(`DROP TABLE "project_parent_task"`);
        await queryRunner.query(`DROP TABLE "project_task"`);
        await queryRunner.query(`DROP TYPE "public"."project_task_priority_enum"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "notification_entity"`);
        await queryRunner.query(`DROP TABLE "event_entity"`);
        await queryRunner.query(`DROP TABLE "goal_entity"`);
        await queryRunner.query(`DROP TYPE "public"."goal_entity_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."goal_entity_category_enum"`);
        await queryRunner.query(`DROP TABLE "goal_task"`);
    }

}
