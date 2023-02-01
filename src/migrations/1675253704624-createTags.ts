import { MigrationInterface, QueryRunner } from "typeorm";

export class createTags1675253704624 implements MigrationInterface {
    name = 'createTags1675253704624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tags"`);
        }

}
