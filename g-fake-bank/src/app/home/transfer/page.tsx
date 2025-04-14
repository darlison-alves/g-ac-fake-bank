'use client';

import Form from "next/form";
import * as smask from 'vlg-mask';
import { useActionState, useEffect, useRef } from "react";

import { ButtonForm } from "@/app/components/button.form";
import { transfer } from "../actions";
import { IInitialState } from "@/app/models/account";

const initialState: IInitialState = {
    success: false,
    message: ''
}

export default function TransferPage() {

    const amountRef = useRef<HTMLInputElement>(null);

    const [states, formAction] = useActionState(transfer, initialState);

    useEffect(() => {
        const input = amountRef.current;
        if (!input) return;

        smask.input(input, ["currency"], undefined);

    }, []);


    useEffect(() => {
        if (states.success) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }, [states.success]);

    return (
        <div>
            <div className="mb-4 font-bold text-gray-500">
                <label>Transferência</label>
            </div>
            <p className="text-red-500 mb-4">{states.message}</p>
            <Form action={formAction} >
                <input
                    type="text"
                    placeholder="conta"
                    name='accountNumber'
                    className="w-full p-3 mb-4 border border-gray-300 rounded"
                />

                <input
                    ref={amountRef}
                    type="text"
                    placeholder="valor (R$)"
                    name='amount'
                    className="w-full p-3 mb-4 border border-gray-300 rounded"
                />
                <ButtonForm type="submit">
                    Transferir
                </ButtonForm>
            </Form>
        </div>
    );
} 