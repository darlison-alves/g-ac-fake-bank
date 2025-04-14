import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionController } from './controller/transaction.controller';
import { TransferBetWeenAccountsUseCase } from './usecases/transfer-between-accounts.usecase';
import { DepositUseCase } from './usecases/deposit.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction';
import { ExtractListUseCase } from './usecases/extract.list.usecase';
import { RefundUseCase } from './usecases/refund.usecase';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]),
        AccountsModule
    ],
    controllers: [TransactionController],
    providers: [TransferBetWeenAccountsUseCase, DepositUseCase, ExtractListUseCase, RefundUseCase],
})
export class TransactionsModule {}
