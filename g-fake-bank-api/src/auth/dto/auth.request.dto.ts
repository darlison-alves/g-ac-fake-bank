import { Request } from "express";

export interface IAuthRequest extends Request {
    user?: {
        sub: number;
        account: string;
    }
}