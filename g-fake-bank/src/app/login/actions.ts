'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData): Promise<void> {
    const account = formData.get("accountNumber");
    const password = formData.get("password");

    const payload = {
        account,
        password,
    };

    const response: any = await fetch("http://localhost:4000/accounts/authenticate", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("response", response)

    if (!response.ok) {
        redirect("/login?error=Invalid credentials");
    }

    const data = await response.json();

    console.log("data", data)

    const cookieStore = await cookies();

    cookieStore.set('token', data.token, {
        httpOnly: true,
        secure: true, // só HTTPS
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    redirect("/home");
}