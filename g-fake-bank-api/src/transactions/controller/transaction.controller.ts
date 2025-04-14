
import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";

import { TransferDTO } from "../dto/transfer.dto";
import { TransferBetWeenAccountsUseCase } from "../usecases/transfer-between-accounts.usecase";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../auth/auth.guard";
import { DepositUseCase } from "../usecases/deposit.usecase";
import { IAuthRequest } from "../../auth/dto/auth.request.dto";
import { ExtractListUseCase } from "../usecases/extract.list.usecase";
import { RefundUseCase } from "../usecases/refund.usecase";

@Controller("transactions")
@ApiTags("transactions")
export class TransactionController {
    constructor(
        private readonly transferBetweenAccountsUseCase: TransferBetWeenAccountsUseCase,
        private readonly depositUseCase: DepositUseCase,
        private readonly extractUseCase: ExtractListUseCase,
        private readonly refundUseCase: RefundUseCase
    ) { }

    @UseGuards(AuthGuard)
    @Post("transfer")
    async transfer(@Request() req: IAuthRequest, @Body() transferDTO: TransferDTO) {
        const user = req.user!;

        transferDTO.fromAccountNumber = user.account;

        await this.transferBetweenAccountsUseCase.execute(transferDTO);
        return { message: "Transfer successful" };
    }

    @UseGuards(AuthGuard)
    @Post("deposit")
    async deposit(@Request() req: IAuthRequest, @Body('amount') amount: number) {

        const user = req.user!;
        
        await this.depositUseCase.execute(user.account, amount);

        return { message: "Deposit successful" };
    }

    @UseGuards(AuthGuard)
    @Get("extracts")
    async getTransactions(@Request() req: IAuthRequest) {
        const user = req.user!;
        return await this.extractUseCase.execute(user.sub);
    }

    @UseGuards(AuthGuard)
    @Post("refund")
    async refund(@Request() req: IAuthRequest, @Body('authentication') authentication: string) {
        const user = req.user!;
        return await this.refundUseCase.execute(authentication);
    }

}