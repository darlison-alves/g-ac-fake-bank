export interface Account {
    id?: number;
    name: string;
    password: string;
    balance?: number;
    accountNumber?: string;
}

export interface IInitialState {
    success: boolean;
    message: string;
}