import {MigrationInterface, QueryRunner} from "typeorm";

export class dropColumnCompanyFlagMigration1671602492814 implements MigrationInterface {
    name = 'dropColumnCompanyFlagMigration1671602492814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `roles`");
        await queryRunner.query("ALTER TABLE `company` DROP COLUMN `flag`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `company` ADD `flag` int NOT NULL");
    }

}
