import { DepositUseCase } from './deposit.usecase';
import { DataSource, EntityManager } from 'typeorm';
import { Transaction } from '../entities/transaction';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';
import { Account } from '../../accounts/entities/account';

jest.mock('../entities/transaction');

describe('DepositUseCase', () => {
  let useCase: DepositUseCase;
  let dataSource: any;
  let transactionalEntityManager: Partial<EntityManager>;

  const mockAccount: Account = {
    id: 1,
    name: 'Test User',
    accountNumber: '123',
    balance: 100,
    password: 'secret',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: []
  };

  beforeEach(() => {
    transactionalEntityManager = {
      save: jest.fn()
    };

    dataSource = {
      transaction: jest.fn((cb) => cb(transactionalEntityManager))
    };

    useCase = new DepositUseCase(dataSource as DataSource);

    // Mock do método herdado de TransactionUseCase
    jest.spyOn(useCase as any, 'getAccount').mockImplementation((accountNumber: string) => {
      if (accountNumber === '123') return Promise.resolve({ ...mockAccount });
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

  it('deve realizar o depósito com sucesso', async () => {
    await useCase.execute('123', 50);

    // Espera que a conta tenha sido atualizada corretamente
    expect(transactionalEntityManager.save).toHaveBeenCalledWith(Account, expect.objectContaining({
      accountNumber: '123',
      balance: 150
    }));

    // Espera que uma transação de depósito tenha sido criada
    expect(transactionalEntityManager.save).toHaveBeenCalledWith(Transaction, expect.objectContaining({
      type: TransactionTypeEnum.DEPOSIT,
      amount: 50
    }));
  });

  it('deve lançar erro se a conta não for encontrada', async () => {
    await expect(useCase.execute('000', 50)).rejects.toThrow('Account not found');
  });
});
