'use client';

import Form from "next/form";
import * as smask from 'vlg-mask';

import { deposit } from "../actions";
import { useActionState, useEffect, useRef, useState } from "react";
import { ButtonForm } from "@/app/components/button.form";

export default function DepositPage() {

    const accountNumberRef = useRef<HTMLInputElement>(null);

    const [, formAction] = useActionState(deposit, null);

    useEffect(() => {
        const input = accountNumberRef.current;
        if (!input) return;

         smask.input(input, ["currency"], undefined);

    }, []);
    return (
        <div>
            <div className="mb-4 font-bold text-gray-500">
                <label>Depósito</label>
            </div>

            <Form action={formAction} >
                <input
                    ref={accountNumberRef}
                    type="text"
                    placeholder="conta"
                    name='amount'
                    className="w-full p-3 mb-4 border border-gray-300 rounded"
                />
                
                <ButtonForm type="submit">
                    Depositar
                </ButtonForm>
            </Form>
        </div>
    )
}