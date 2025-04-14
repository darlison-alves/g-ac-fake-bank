import { ReactNode } from "react";
import { getAccount, logout } from "./actions";
import Link from "next/link";

export default async function HomeLayout({ children }: { children: ReactNode }) {

    const account = await getAccount();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            <div className="dark:bg-white p-8 rounded shadow-md w-full max-w-md">

                <div onClick={logout} className="flex justify-end items-center mb-4 cursor-pointer font-bold">
                    <h3>SAIR</h3>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl">Olá, {account.name}</h1>
                    <h3 className="text-md">conta: {account.account}</h3>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md">Saldo disponível</h3>
                    <h3 className="text-md">{account?.balance}</h3>
                </div>
                <hr className="border-gray-300 my-5" />

                <div className="flex gap-5 justify-start items-center mb-4">

                    <Link href="/home/deposit" className=" p-4 border border-gray-200 rounded mb-4 bg-purple-200 text-purple-800 font-bold cursor-pointer">
                        <label className="cursor-pointer">Depositar</label>
                    </Link>

                    <Link href="/home/transfer" className="p-4 border border-gray-200 rounded mb-4 bg-purple-200 text-purple-800 font-bold cursor-pointer">
                        <label className="cursor-pointer">Transferência</label>
                    </Link>

                    <Link href="/home/extracts"className="p-4 border border-gray-200 rounded mb-4 bg-purple-200 text-purple-800 font-bold cursor-pointer">
                        <label className="cursor-pointer">Extrato</label>
                    </Link>
                </div>

                <hr className="border-gray-300 my-5" />
                {children}
            </div>


        </main>
    );
}
