'use client';

import { useParams } from "next/navigation";

export default function TransactionPage() {
    
    const params = useParams();
    const { transaction } = params as { transaction: string };
    console.log("transaction", transaction);
    
    return (
        <div className="flex flex-col items-center text-bold y-Center">
            <h2> Cancelar transação ? </h2>

            <div className="flex flex-col items-center mt-4">
                <button className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700" >confirmar</button>
            </div>
        </div>
    )
}