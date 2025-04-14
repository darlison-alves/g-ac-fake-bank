import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionTypeEnum } from "../enums/transaction-type.enum";
import { randomUUID } from "node:crypto";
import { Account } from "../../accounts/entities/account";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, (account) => account.transactions)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ type: "enum", enum: TransactionTypeEnum })
    type: TransactionTypeEnum;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number;

    @Column()
    authentication: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    static of(account: Account, type: TransactionTypeEnum, amount: number): Transaction {
        const transaction = new Transaction();
        transaction.account = account;
        transaction.type = type;
        transaction.amount = amount;
        transaction.authentication = randomUUID();
        return transaction;
    }


}