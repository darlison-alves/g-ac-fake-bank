'use server'

import { Account } from "../models/account";

// import { redirect } from 'next/navigation'

export async function createPost(prevState: any, formData: FormData): Promise<{ success: boolean, account: Account, message: string }> {

    const payload = {
        name: formData.get('name'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }

    const response: any = await fetch("http://localhost:4000/accounts", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return response.json();
    });

    console.log("response", response)

    if (response.id) {
        return  {
            account: response,
            message: '',
            success: true
        }
    } else {
        return {
            account: {} as Account,
            message: response.message || 'Erro ao criar conta',
            success: false,
        }
    }

}