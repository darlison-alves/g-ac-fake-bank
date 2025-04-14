import { NotFoundException } from "@nestjs/common";
import { Account } from "../../accounts/entities/account";
import { DataSource } from "typeorm";

export abstract class TransactionUseCase {

    protected dataSource: DataSource

    constructor( dataSource: DataSource ) {
        this.dataSource = dataSource;
    }

    protected async getAccount(accountNumber: string): Promise<Account> {

        const accountRepo = this.dataSource.getRepository(Account);
        const account = await accountRepo.findOne({ where: { accountNumber } });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return account;
    }
}
