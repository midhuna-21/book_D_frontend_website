import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { adminAxiosInstance } from "../../utils/api/axiosInstance";
import { toast } from "sonner";

interface Transaction {
    _id: string;
    total_amount: number;
    source: string;
    createdAt: string;
    status: "credit" | "debit";
}

const WalletTransactionsList: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [viewMode, setViewMode] = useState("all");
    const [searchKey, setSearchKey] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 

    const navigate = useNavigate();

    const fetchTransactions = async () => {
        try {
            const response = await adminAxiosInstance.get("/get-wallet-transactions");
            if (response.status === 200) {
               console.log(response.data)
                setTransactions(response?.data?.transactions); 
            } else {
                toast.error("Error fetching wallet transactions");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch transactions");
            toast.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleViewModeChange = (mode: string) => {
        setViewMode(mode);
    };

 

    const filteredTransactions = () => {
        return transactions.filter((transaction) => {
           const matchesViewMode =
                viewMode === "all" ||
                (viewMode === "credit" && transaction.status === "credit") ||
                (viewMode === "debit" && transaction.status === "debit");
            return  matchesViewMode;
        });
    };

    if (loading) {
        return <div className="text-gray-500 text-center">Loading...</div>;
    }

    return (
        <div className="bg-stone-800 shadow-md rounded p-4 h-full">
            <h2 className="text-xl font-bold mb-4 text-zinc-300">Wallet Transactions List</h2>
            <div className="mb-4 flex justify-between">
                <div>
                    <button
                        onClick={() => handleViewModeChange("all")}
                        className={`px-4 py-2 rounded ${viewMode === "all" ? "bg-teal-800 text-white" : "bg-gray-200"} mr-2`}>
                        All Transactions
                    </button>
                    <button
                        onClick={() => handleViewModeChange("credit")}
                        className={`px-4 py-2 rounded ${viewMode === "credit" ? "bg-green-800 text-white" : "bg-gray-200"} mr-2`}>
                        Credits
                    </button>
                    <button
                        onClick={() => handleViewModeChange("debit")}
                        className={`px-4 py-2 rounded ${viewMode === "debit" ? "bg-red-800 text-white" : "bg-gray-200"}`}>
                        Debits
                    </button>
                </div>
               
            </div>
            <div className="h-96 overflow-y-auto">
                {filteredTransactions().length === 0 ? (
                    <div className="text-gray-500 mb-4 flex items-center justify-center h-full">
                        No transactions found
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="min-w-full bg-stone-800">
                            <thead className="sticky top-0 bg-gray-200 shadow">
                                <tr>
                                    <th className="py-2 px-4 border-b text-center">Amount</th>
                                    <th className="py-2 px-4 border-b text-center">Type</th>
                                    <th className="py-2 px-4 border-b text-center">Date</th>
                                    <th className="py-2 px-4 border-b text-center">Transaction type</th>
                                    <th className="py-2 px-4 border-b text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions().map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {(transaction.total_amount)} ₹
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {transaction.status === "credit" ? "Credit" : "Debit"}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {transaction.status}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {transaction.source}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletTransactionsList;
