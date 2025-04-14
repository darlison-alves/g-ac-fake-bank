import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Account } from '../../../src/accounts/entities/account';
import { Transaction } from '../../../src/transactions/entities/transaction';
import { TransferDTO } from '../../../src/transactions/dto/transfer.dto';
import { TransferBetWeenAccountsUseCase } from '../../../src/transactions/usecases/transfer-between-accounts.usecase';
import { AppModule } from '../../../src/app.module'; // substitua se necessário
import { InsufficientFundsException } from '../../../src/exceptions/insuffucient-funds.exception';
import { generateAccountNumber } from '../../../src/utils/account.utils';

describe('TransferBetWeenAccountsUseCase (e2e)', () => {
    let useCase: TransferBetWeenAccountsUseCase;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        useCase = moduleFixture.get(TransferBetWeenAccountsUseCase);
        dataSource = moduleFixture.get(DataSource);
    });

    beforeEach(async () => {
        await dataSource.synchronize(true); // limpa o banco a cada teste
    });

    it('should transfer funds between accounts and create two transactions', async () => {

        const accountNumber1 = generateAccountNumber().toString();
        const accountNumber2 = generateAccountNumber().toString();

        const c1 = {
            accountNumber: accountNumber1,
            balance: 100,
            name: 'Test Account',
            password: 'password123',
        }

        const c2 = {
            accountNumber: accountNumber2,
            balance: 50,
            name: 'Test Account',
            password: 'password123',
        }

        const accountRepo = dataSource.getRepository(Account);
        const transactionRepo = dataSource.getRepository(Transaction);

        const sender = await accountRepo.save(c1);
        const receiver = await accountRepo.save(c2);

        const dto: TransferDTO = {
            fromAccountNumber: accountNumber1,
            toAccountNumber: accountNumber2,
            amount: 30,
        };

        await useCase.execute(dto);

        const updatedSender = await accountRepo.findOneBy({ id: sender.id });
        const updatedReceiver = await accountRepo.findOneBy({ id: receiver.id });

        const transactions = await transactionRepo.find({
            where: { account: { id: sender.id } },
        });


        expect(updatedSender.balance).toBe("70.00");
        expect(updatedReceiver.balance).toBe("80.00");

        const allTransactions = await transactionRepo.find();
        expect(allTransactions.length).toBeGreaterThanOrEqual(2);

        const senderTx = allTransactions.find(t => t.amount < 0);
        const receiverTx = allTransactions.find(t => t.amount > 0);

        expect(senderTx.account.id).toBe(sender.id);
        expect(receiverTx.account.id).toBe(sender.id); // conforme seu código
        expect(senderTx.amount).toBe(-30);
        expect(receiverTx.amount).toBe(30);

    });

    it('should throw InsufficientFundsException if sender has no money', async () => {
        const accountRepo = dataSource.getRepository(Account);

        const accountNumber1 = generateAccountNumber().toString();
        const accountNumber2 = generateAccountNumber().toString();

        const c1 = {
            accountNumber: accountNumber1,
            balance: 10,
            name: 'Test Account',
            password: 'password123',
        }

        const c2 = {
            accountNumber: accountNumber2,
            balance: 50,
            name: 'Test Account',
            password: 'password123',
        }

        const sender = await accountRepo.save(c1);
        const receiver = await accountRepo.save(c2);

        const dto: TransferDTO = {
            fromAccountNumber: accountNumber1,
            toAccountNumber: accountNumber2,
            amount: 100,
        };

        await expect(useCase.execute(dto)).rejects.toThrow(InsufficientFundsException);
    });
});
