'use client'

import Form from "next/form";
import { createPost } from "./actions";
import { ButtonForm } from "../components/button.form";
import { FieldsRegisterForm } from "../components/fields.register.form";
import { useActionState } from "react";
import { Account } from "../models/account";
import Link from "next/link";

const initialState = {
    message: '',
    success: false,
    account: {} as Account,
}

export default function Page() {

    const [state, formAction] = useActionState(createPost, initialState);

    console.log("state", state)

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="dark:bg-white p-8 rounded shadow-md w-full max-w-md">

                {!state.success && (
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl">Crie sua conta</h1>
                    </div>

                )}
                {state.message && (
                    <div className="text-red-500 text-center mt-4">
                        {state.message}
                    </div>
                )}

                {!state.success && (
                    <Form action={formAction} className="flex flex-col gap-4">

                        <FieldsRegisterForm />

                        <div className="flex justify-center">
                            <ButtonForm type="submit">
                                Criar Conta
                            </ButtonForm>
                        </div>
                    </Form>
                )}

                {state.success && (
                    <div className="text-purple-500 text-center mt-4 ">
                        <h2 className="text-2xl">Conta criada com sucesso!</h2>
                        <p className="text-gray-500">Agora você pode fazer login.</p>

                        <div className="mt-4 text-left">
                            <h3 className="text-xl">Dados da conta:</h3>
                            <p><strong>Nome:</strong> {state.account.name}</p>
                            <p><strong>Número da Conta:</strong> {state.account.accountNumber}</p>
                        </div>

                        <div className="flex justify-center mt-4">

                            <Link href="/login" className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700">Fazer Login</Link>

                        </div>
                    </div>
                )}
                <div className="mt-4 text-center">
                    <p className="text-gray-500">
                        já tem uma conta?{' '}
                        <a href="/login" className="text-purple-600 hover:underline">
                            Entrar
                        </a>
                    </p>
                </div>

            </div>



        </main>
    )
}