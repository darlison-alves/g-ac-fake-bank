import { ApiProperty } from "@nestjs/swagger";
import { Account } from "../entities/account";

export class AccountDTO {

    @ApiProperty({
        description: "Account ID",
        example: 1,
    })    
    id: number;
    
    @ApiProperty({
        description: "Account number",
        example: "1234567890",
    })
    account: string;
    
    @ApiProperty({
        description: "Account balance",
        example: "R$ 1.000,00",
    })
    balance: string;
    
    @ApiProperty({
        description: "Account name",
        example: "John Doe",
    })
    name: string;

    constructor(id: number, account: string, balance: string, name?: string) {
        this.id = id;
        this.account = account;
        this.balance = balance;
        this.name = name || "";
    }

    public static from(account: Account): AccountDTO {

        const balance = Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" }).format(account.balance)

        return new AccountDTO(account.id, account.accountNumber, balance, account.name);
    }
}