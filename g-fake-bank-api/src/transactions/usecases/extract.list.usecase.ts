import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { Transaction } from "../entities/transaction";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ExtractListUseCase {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>) { }

    async execute(accountId: number): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: { account: { id: accountId } },
            order: { createdAt: 'DESC' },
        });
    }
}
