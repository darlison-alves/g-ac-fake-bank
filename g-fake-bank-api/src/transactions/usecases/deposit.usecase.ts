import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TransactionTypeEnum } from "../enums/transaction-type.enum";
import { TransactionUseCase } from "./transaction.usecase";
import { Transaction } from "../entities/transaction";
import { Account } from "../../accounts/entities/account";

@Injectable()
export class DepositUseCase extends TransactionUseCase {

    constructor(
        protected readonly dataSource: DataSource,
    ) {
        super(dataSource);
    }

    async execute(accountNumber: string, amount: number) {
        
        const account = await this.getAccount(accountNumber);

        const transaction = Transaction.of(
            account,
            TransactionTypeEnum.DEPOSIT,
            amount
        );

        await this.dataSource.transaction(async (transactionalEntityManager) => {

            account.balance = Number(account.balance) + Number(amount);

            await transactionalEntityManager.save(Account, account);
            await transactionalEntityManager.save(Transaction, transaction);
        });

    }
}