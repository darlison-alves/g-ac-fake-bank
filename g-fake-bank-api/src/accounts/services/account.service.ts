import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDTO } from '../dto/create-account.dto';
import { Account } from '../entities/account';
import { hashPassword } from '../../utils/account.utils';
import { InsufficientFundsException } from '../../exceptions/insuffucient-funds.exception';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) {}

    async create(accountData: CreateAccountDTO): Promise<Account> {

        const totalAccount = await this.accountRepository.count();

        accountData.password = await hashPassword(accountData.password);

        const account = Account.of(accountData, totalAccount);
        return this.accountRepository.save(account);
    }

    async addFunds(accountId: number, amount: number): Promise<Account> {   
        const account = await this.getAccount(accountId);
        
        const balance = Number(account.balance) + Number(amount);

        account.balance = balance;

        return await this.accountRepository.save(account);
    }

    async getAccount(accountId: number): Promise<Account> {
        const account = await this.accountRepository.findOne({ where: { id: accountId } });

        console.log(account);
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return account;
    }

    async getAccountByNumber(accountNumber: string): Promise<Account> {
        const account = await this.accountRepository.findOne({ where: { accountNumber } });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return account;
    }
    
    async withdrawFunds(accountId: number, amount: number): Promise<Account> {  
        const account = await this.getAccount(accountId);
        
        if (account.balance < amount) {
            throw new InsufficientFundsException();
        }
        account.balance -= amount;
        return await this.accountRepository.save(account);
    }

    async transaferBetweenAccounts(
        senderAccount: Account,
        receiverAccount: Account,
        amount: number,
    ): Promise<Account[]> {
        await this.accountRepository.manager.transaction(async (transactionalEntityManager) => {
            senderAccount.balance -= amount;
            receiverAccount.balance += amount;
            await transactionalEntityManager.save(senderAccount);
            await transactionalEntityManager.save(receiverAccount);
        });

        return [senderAccount, receiverAccount];
    }
}


