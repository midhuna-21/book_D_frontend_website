import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";

interface ITransaction {
    _id: string;
    type: "credit" | "debit";
    total_amount: number;
    source: string;
    createdAt: Date;
}

interface IWallet {
    _id: string;
    wallet: string;
    balance: number;
    transactions: ITransaction[];
}

const BookWallet: React.FC = () => {
    const [wallet, setWallet] = useState<IWallet | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [balance, setBalance] = useState(0);
    const [transactionsPerPage] = useState(5);
    const userInfo = useSelector(
        (state: RootState) => state.user.userInfo?.user
    );
    const userId = userInfo?._id || "";

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const response = await adminAxiosInstance.get(
                    "/wallet/transactions"
                );

                if (Array.isArray(response?.data) && response.data.length > 0) {
                    const walletData = response.data[0];
                    setBalance(walletData.balance);
                    setWallet(walletData);
                } else {
                    console.error("Wallet data not found in the response");
                }
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };
        fetchWalletData();
    }, [userId]);

    const transactions = wallet?.transactions ?? [];
    console.log(transactions, "transactions");

    const totalPages =
        transactions.length > 0
            ? Math.ceil(transactions.length / transactionsPerPage)
            : 1;

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction =
        indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
    );

    return (
        <div className="flex flex-col items-center py-4 bg-white min-h-screen rounded">
            <div className=" flex items-center justify-center flex-col">
                <h1 className="text-2xl font-serif text-black mt-12">Wallet</h1>
                <p className="text-sm text-gray-600 mt-2">
                    {currentTransactions.length === 0 && balance === 0 ? (
                        <span>
                            No transactions available.
                            <span className="text-red-500 font-bold text-lg ml-1">
                                !
                            </span>
                        </span>
                    ) : (
                        " "
                    )}
                </p>
            </div>

            {wallet && (
                <div className="w-full max-w-[1300px] p-3 mx-auto">
                    <div className="w-full overflow-x-auto">
                        <span className="text-lg font-semibold text-white block mb-3">
                            Balance: {wallet.balance}₹
                        </span>
                        {currentTransactions.filter(
                            (transaction) => transaction.total_amount > 0
                        ).length > 0 ? (
                            <table className="min-w-full border-separate border-spacing-y-1">
                                <thead className="sticky top-0 bg-gray-200 shadow">
                                    <tr>
                                        <th className="text-left py-2 px-4 border-b text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="text-left py-2 px-4 border-b text-gray-500 uppercase tracking-wider">
                                            Source
                                        </th>
                                        <th className="text-left py-2 px-4 border-b text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="text-left py-2 px-4 border-b text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions
                                        .filter(
                                            (transaction) =>
                                                transaction.total_amount > 0
                                        )
                                        .map((transaction) => (
                                            <tr
                                                key={transaction._id}
                                                className="odd:bg-white even:bg-gray-50 border-b">
                                                <td className="font-medium text-gray-700 text-sm text-left py-3 px-4 whitespace-nowrap">
                                                    ₹
                                                    {transaction.total_amount.toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td className="font-medium text-gray-700 text-sm text-left px-4 whitespace-nowrap">
                                                    {transaction.source ===
                                                    "payment_to_lender"
                                                        ? "Payment"
                                                        : "Refund"}
                                                </td>
                                                <td className="font-medium text-gray-700 text-sm text-left px-4 whitespace-nowrap">
                                                    {transaction.type ===
                                                    "credit"
                                                        ? "Credit"
                                                        : "Debit"}
                                                </td>
                                                <td className="font-medium text-gray-700 text-sm text-left px-4 whitespace-nowrap">
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-500 mt-4">
                                Wallet is empty
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookWallet;
