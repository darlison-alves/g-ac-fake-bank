import { IsNotEmpty, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class TransferDTO {

    fromAccountNumber: string;
    
    @ApiProperty({
        description: "Account number of the receiver",
        example: "0987654321",
    })
    @IsNotEmpty()
    toAccountNumber: string;

    @ApiProperty({
        description: "Amount to transfer",
        example: 100,
    })
    @Min(0, {
        message: "Amount must be greater than 0",
    })
    amount: number;
}
