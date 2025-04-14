import { compare, hash } from "bcrypt";

export function generateAccountNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

export function buildPrefixAccountNumber(prefix: number, accountNumber: number): string {
    const prefixString = prefix >= 10 ? prefix.toString() : `0${prefix}`;
    return `${prefixString}${accountNumber}`;
}

export async function hashPassword(password: string): Promise<string> {
    const salt = 10;
    return hash(password, salt);
}


export async function hashCompare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
}
