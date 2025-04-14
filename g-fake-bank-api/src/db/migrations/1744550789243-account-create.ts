import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountCreate1744550789243 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "account" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "accountNumber" VARCHAR(255) NOT NULL,
                "balance" DECIMAL DEFAULT 0,
                "password" VARCHAR(255) NOT NULL,
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW()
            )
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_account_number" ON "account" ("accountNumber")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_account_number"
        `);
        await queryRunner.query(`
            DROP TABLE "account"
        `);
    }

}
