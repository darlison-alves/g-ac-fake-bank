import { HttpException } from "@nestjs/common";

export class InsufficientFundsException extends HttpException {
    constructor() {
        super({ message: 'Insufficient funds' }, 400);
    }
}