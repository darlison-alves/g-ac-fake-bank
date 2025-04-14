import { TransferDTO } from '../dto/transfer.dto';
import { Account } from '../../accounts/entities/account';
import { TransferBetWeenAccountsUseCase } from './transfer-between-accounts.usecase';
import { DataSource, EntityManager } from 'typeorm';
import { Transaction } from '../entities/transaction';
import { InsufficientFundsException } from '../../exceptions/insuffucient-funds.exception';

jest.mock('../entities/transaction');

describe('TransferBetWeenAccountsUseCase', () => {
  let useCase: TransferBetWeenAccountsUseCase;
  let dataSource: any;
  let transactionalEntityManager: Partial<EntityManager>;

  const mockSenderAccount: Account = {
    id: 1,
    name: 'Sender',
    accountNumber: '123',
    balance: 100,
    password: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: []
  };

  const mockReceiverAccount: Account = {
    id: 2,
    name: 'Receiver',
    accountNumber: '456',
    balance: 50,
    password: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: []
  };

  const transferDTO: TransferDTO = {
    fromAccountNumber: '123',
    toAccountNumber: '456',
    amount: 40
  };

  beforeEach(() => {
    transactionalEntityManager = {
      save: jest.fn()
    };

    dataSource = {
      manager: {
        transaction: jest.fn((cb: any) => cb(transactionalEntityManager))
      }
    };

    useCase = new TransferBetWeenAccountsUseCase(dataSource as DataSource);

    // Mock do método herdado de TransactionUseCase
    jest.spyOn(useCase as any, 'getAccount').mockImplementation((accountNumber: string) => {
      if (accountNumber === '123') return Promise.resolve({ ...mockSenderAccount });
      if (accountNumber === '456') return Promise.resolve({ ...mockReceiverAccount });
      throw new Error('Account not found');
    });

    // Mock estático
    (Transaction.of as jest.Mock).mockImplementation((account, type, amount) => ({
      id: undefined,
      account,
      type,
      amount,
      authentication: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  });

  it('deve transferir corretamente entre duas contas', async () => {
    await useCase.execute(transferDTO);

    expect(transactionalEntityManager.save).toHaveBeenCalledWith(Account, expect.objectContaining({
      accountNumber: '123',
      balance: 60 // 100 - 40
    }));

    expect(transactionalEntityManager.save).toHaveBeenCalledWith(Account, expect.objectContaining({
      accountNumber: '456',
      balance: 90 // 50 + 40
    }));

    expect(transactionalEntityManager.save).toHaveBeenCalledWith(Transaction, expect.any(Array));
  });

  it('deve lançar erro se o saldo for insuficiente', async () => {
    (useCase as any).getAccount = jest.fn().mockImplementation((accountNumber: string) => {
      if (accountNumber === '123') return Promise.resolve({ ...mockSenderAccount, balance: 10 });
      if (accountNumber === '456') return Promise.resolve({ ...mockReceiverAccount });
    });

    await expect(useCase.execute(transferDTO)).rejects.toThrow(InsufficientFundsException);
  });

  it('deve lançar erro se uma conta não for encontrada', async () => {
    (useCase as any).getAccount = jest.fn().mockImplementation(() => {
      throw new Error('Account not found');
    });

    await expect(useCase.execute(transferDTO)).rejects.toThrow('Account not found');
  });
});
