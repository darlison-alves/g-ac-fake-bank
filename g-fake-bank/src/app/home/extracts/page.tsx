import { ListTransactions } from "../components/list.transactions";

export default function ExtractsPage() {
    return (
        <div>
            <div className="mb-4 font-bold">
                <label>Extrato</label>
            </div>

            <ListTransactions />

        </div>
    )
}