import receiver from "../../../assets/money-recive-svgrepo-com.svg";
import sender from "../../../assets/money-send-svgrepo-com.svg";

import Image from "next/image";
import { getTransactions } from "../actions";
import Link from "next/link";


export async function ListTransactions({ limit }: { limit?: number }) {

    const transactions: any = await getTransactions();


    return (
        <ul role="list" className="max-h-100 overflow-x-auto divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 p-3">

            {
                transactions.map((transaction: any, index: number) => {

                    if (limit && index > limit) return null;

                    return <li key={transaction.id} className="py-3 sm:py-4">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                {
                                    transaction.amount > 0 ? <Image className="w-8 h-8 rounded-full" src={receiver} alt="Neil image" /> : <Image className="w-8 h-8 rounded-full" src={sender} alt="Neil image" />
                                }

                            </div>
                            <div className="flex-1 min-w-0 ms-4">
                                <p className="text-sm font-medium text-gray-900 truncate ">
                                    {transaction.type}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {transaction.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(transaction.amount)}
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-500 ">
                                {new Date(transaction.createdAt).toLocaleDateString('pt-BR', {
                                    month: 'short',
                                    day: '2-digit'
                                })}
                            </div>
                            <Link href={`/home/extracts/${transaction.authentication}`} data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="border border-red-500 rounded p-2 ml-4 bg-red-500 cursor-pointer" >
                                <strong className="text-white">x</strong>
                            </Link>
                        </div>
                    </li>
                })
            }

            {/* <RefundPopup hidden={hidden}  /> */}
        </ul>
    )
}