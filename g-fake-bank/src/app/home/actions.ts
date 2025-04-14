'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as smask from 'vlg-mask';
import { IInitialState } from "../models/account";


export async function getTransactions() {
    
    const cookieStore = await cookies();
    const response = await fetch("http://localhost:4000/transactions/extracts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookieStore.get('token')?.value}`,
        },
    });

    const data = await response.json();
    return data
}

export async function getAccount() {

    const cookieStore = await cookies();

    const response = await fetch("http://localhost:4000/accounts/info", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookieStore.get('token')?.value}`,
        },
    });

    const data = await response.json();
    console.log("data", data);


    return data
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token')
    redirect('/login')
}

export async function deposit(_: any, formData: FormData): Promise<void> {

    const amount = formData.get('amount')?.toString() || '0';

    const amountUnformat = smask.currencyUnformat(amount, 'pt-BR', "BRL");

    const cookieStore = await cookies();

    const response = await fetch("http://localhost:4000/transactions/deposit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookieStore.get('token')?.value}`,
        },
        body: JSON.stringify({
            amount: amountUnformat,
        }),
    });

    const data = await response.json();
    console.log("data", data);
    
    redirect('/home')
}


export async function transfer(_: IInitialState, formData: FormData): Promise<IInitialState> {

    const toAccountNumber = formData.get('accountNumber')?.toString() || '0';
    const amount = formData.get('amount')?.toString() || '0';

    const amountUnformat = smask.currencyUnformat(amount, 'pt-BR', "BRL");

    const cookieStore = await cookies();

    const response = await fetch("http://localhost:4000/transactions/transfer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookieStore.get('token')?.value}`,
        },
        body: JSON.stringify({
            toAccountNumber,
            amount: amountUnformat,
        }),
    });

    if (!response.ok) {

        const data = await response.json();
        console.log("errr data", data);
        return {
            success: false,
            message: data.message,
        }
    }

    const data = await response.json();
    console.log("data", data);
    
    return {
        success: true,
        message: "Transferência realizada com sucesso",
    }
}
