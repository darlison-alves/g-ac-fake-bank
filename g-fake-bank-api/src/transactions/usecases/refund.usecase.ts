import { DataSource, EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";

import { Transaction } from "../entities/transaction";
import { TransactionTypeEnum } from "../enums/transaction-type.enum";
import { TransactionUseCase } from "./transaction.usecase";
import { Account } from "src/accounts/entities/account";

@Injectable()
export class RefundUseCase extends TransactionUseCase {
    constructor(
        protected readonly dataSource: DataSource,
    ) {
        super(dataSource)
    }

    async execute(authentication: string): Promise<void> {

        this.dataSource.transaction(async (em) => {
            const transactions = await this.dataSource.manager.find(Transaction, {
                where: { authentication: authentication },
                relations: ['account'],
            });
            
            for(const transaction of transactions) {
                await this.undoTransaction(transaction, em);
            }

        });
    }

    private undoTransaction(transaction: Transaction , em: EntityManager): void {
        
        const amount = Number(transaction.amount)* -1;
        
        const account = transaction.account;
        account.balance = Number(account.balance) + amount;

        const newTransaction = Transaction.of(account, TransactionTypeEnum.REVERTED, amount);

        em.save(Transaction, newTransaction);
        em.save(Account, account);

    }
}

