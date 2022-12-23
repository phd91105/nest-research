import {MigrationInterface, QueryRunner} from "typeorm";

export class addRefreshTokenMigration1671587208550 implements MigrationInterface {
    name = 'addRefreshTokenMigration1671587208550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `refreshToken` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL, `token` varchar(255) NOT NULL, `userId` int NOT NULL, `expiresAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `refreshToken`");
    }

}
