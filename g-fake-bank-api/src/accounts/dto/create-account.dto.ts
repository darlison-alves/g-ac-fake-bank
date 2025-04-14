import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAccountDTO {

    @ApiProperty({
        description: "Account number",
        example: "1234567890",
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "Account password",
        example: "123456",
    })
    @IsNotEmpty()
    password: string;
}