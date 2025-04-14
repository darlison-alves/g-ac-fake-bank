import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreateAccountDTO } from "../dto/create-account.dto";
import { buildPrefixAccountNumber, generateAccountNumber } from "../../utils/account.utils";
import { Transaction } from "../../transactions/entities/transaction";

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    accountNumber: string;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    balance: number;

    @Column()
    password: string;

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    public static of(createAccountDto: CreateAccountDTO, totalAccount: number): Account {
        const account = new Account();
        const accountNumberSufix = generateAccountNumber();
        const accountNumber = buildPrefixAccountNumber(totalAccount, accountNumberSufix);

        account.name = createAccountDto.name;
        account.accountNumber = accountNumber;
        account.balance = 0;
        account.password = createAccountDto.password;
        return account;
    }
}