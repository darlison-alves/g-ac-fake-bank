import { Body, Controller, Get, Post, Request, UseFilters, UseGuards } from "@nestjs/common";
import { AccountService } from "../services/account.service";
import { CreateAccountDTO } from "../dto/create-account.dto";
import { HttpExceptionFilter } from "../../filters/http-exception.filter";
import { LoginAccountDTO } from "../dto/login-account.dto";
import { AuthenticateUseCase } from "../usecase/authenticate.usecase";
import { AuthGuard } from "../../auth/auth.guard";
import { IAuthRequest } from "../../auth/dto/auth.request.dto";
import { AccountDTO } from "../dto/account.dto";

@Controller('accounts')
@UseFilters(HttpExceptionFilter)
export class AccountController {

    constructor(
        private readonly accountService: AccountService,
        private readonly authenticateUseCase: AuthenticateUseCase
    ) { }

    @Post()
    async create(@Body() createAccountDto: CreateAccountDTO) {
        return this.accountService.create(createAccountDto);
    }

    @Post("authenticate")
    async authenticate(@Body() payload: LoginAccountDTO) {
        const account = await this.authenticateUseCase.execute(payload);
        return account;
    }

    @UseGuards(AuthGuard)
    @Get('info')
    async getAccount(@Request() req: IAuthRequest) {
        const user = req.user!;
        const account = await this.accountService.getAccount(user.sub);

        return AccountDTO.from(account);
    }
}