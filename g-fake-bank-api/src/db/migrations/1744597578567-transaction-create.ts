import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionCreate1744597578567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS transaction (
                id SERIAL PRIMARY KEY,
                account_id INTEGER NOT NULL,
                type VARCHAR(50) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                authentication VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (account_id) REFERENCES account(id)
            );
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_transaction_account_id ON transaction (account_id);
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_transaction_type ON transaction (type);
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_transaction_created_at ON transaction (created_at);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX idx_transaction_created_at;
        `);
        await queryRunner.query(`
            DROP INDEX idx_transaction_type;
        `);
        await queryRunner.query(`
            DROP INDEX idx_transaction_account_id;
        `);
        await queryRunner.query(`
            DROP TABLE transaction;
        `);
    }

}
