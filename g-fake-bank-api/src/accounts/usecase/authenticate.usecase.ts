import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hashCompare } from "../../utils/account.utils";
import { LoggerInAccountDTO } from "../dto/logged-account.dto";
import { LoginAccountDTO } from "../dto/login-account.dto";
import { AccountService } from "../services/account.service";

@Injectable()
export class AuthenticateUseCase {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService,
    ) {}

    async execute(payload: LoginAccountDTO): Promise<LoggerInAccountDTO> {
        const account = await this.accountService.getAccountByNumber(payload.account);
       
        const isMatched =  await hashCompare(payload.password, account.password);

        if(!isMatched) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.jwtService.signAsync({ sub: account.id, account: account.accountNumber });

        return new LoggerInAccountDTO(token);
    }
}

