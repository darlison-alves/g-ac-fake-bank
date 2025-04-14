import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { DepositUseCase } from '../../../src/transactions/usecases/deposit.usecase';
import { AppModule } from '../../../src/app.module';
import { Account } from '../../../src/accounts/entities/account';
import { Transaction } from '../../../src/transactions/entities/transaction';
import { generateAccountNumber } from '../../../src/utils/account.utils';
import { TransactionTypeEnum } from '../../../src/transactions/enums/transaction-type.enum';

describe('DepositUseCase (e2e)', () => {
    let app: INestApplication;
    let depositUseCase: DepositUseCase;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        depositUseCase = moduleFixture.get<DepositUseCase>(DepositUseCase);
        dataSource = moduleFixture.get<DataSource>(DataSource);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should deposit into account and update balance and create transaction', async () => {
        
        const accountNumber = generateAccountNumber().toString();

        // criar uma conta de teste direto no banco
        const accountRepo = dataSource.getRepository(Account);
        const savedAccount = await accountRepo.save({
            accountNumber: accountNumber,
            balance: 100,
            name: 'Test Account',
            password: 'password123',
        });

        // executar o use case
        await depositUseCase.execute(accountNumber, 50);

        // verificar se o saldo foi atualizado
        const updatedAccount = await accountRepo.findOneBy({ id: savedAccount.id });
        expect(updatedAccount.balance).toBe("150.00");

        // verificar se transação foi criada
        const transactionRepo = dataSource.getRepository(Transaction);
        const transactions = await transactionRepo.find({
            where: { account: { id: savedAccount.id } },
        });

        if (transactions.length) {
            await transactionRepo.delete(transactions.map(transaction => transaction.id));
        }
        await accountRepo.delete(savedAccount.id);

        expect(transactions.length).toBe(1);
        expect(transactions[0].type).toBe(TransactionTypeEnum.DEPOSIT);
        expect(transactions[0].amount).toBe("50.00");
    });
});
