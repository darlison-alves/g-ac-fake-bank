import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { AuthenticateUseCase } from './usecase/authenticate.usecase';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Account]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '2h' },
        }),
    ],
    controllers: [AccountController],
    providers: [AccountService, AuthenticateUseCase],
})
export class AccountsModule { }
