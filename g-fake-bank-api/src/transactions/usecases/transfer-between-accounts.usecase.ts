import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Transaction } from "../entities/transaction";
import { TransferDTO } from "../dto/transfer.dto";
import { InsufficientFundsException } from "../../exceptions/insuffucient-funds.exception";
import { TransactionTypeEnum } from "../enums/transaction-type.enum";
import { Account } from "../../accounts/entities/account";
import { TransactionUseCase } from "./transaction.usecase";
import { randomUUID } from "crypto";

@Injectable()
export class TransferBetWeenAccountsUseCase extends TransactionUseCase {

    constructor(
        protected readonly dataSource: DataSource,
    ) {
        super(dataSource);
     }

    async execute(transferDTO: TransferDTO) {
        const senderAccount =  await this.getAccount(transferDTO.fromAccountNumber);
        const receiverAccount =  await this.getAccount(transferDTO.toAccountNumber);
    
        if (senderAccount.balance < transferDTO.amount) {
            throw new InsufficientFundsException();
        }

        const authentication = randomUUID()
        
        const senderTransaction = Transaction.of(
            senderAccount,
            TransactionTypeEnum.TRANSFER,
            transferDTO.amount * -1
        );

        const receiverTransaction = Transaction.of(
            receiverAccount,
            TransactionTypeEnum.TRANSFER,
            transferDTO.amount
        );

        senderTransaction.authentication = authentication;
        receiverTransaction.authentication = authentication;

        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            
            senderAccount.balance = Number(senderAccount.balance) - Number(transferDTO.amount);
            receiverAccount.balance = Number(receiverAccount.balance) + Number(transferDTO.amount);

            await transactionalEntityManager.save(Account, senderAccount);
            await transactionalEntityManager.save(Account, receiverAccount);

            await transactionalEntityManager.save(Transaction, [senderTransaction, receiverTransaction]);
        });

    }

}