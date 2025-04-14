
import { ListTransactions } from "./components/list.transactions";

export default async function HomePage() {

    return (
        <div>

            <div className="mb-4 font-bold">
                <label>Transações recentes</label>
            </div>

            <ListTransactions limit={3} />

        </div>
    )
}