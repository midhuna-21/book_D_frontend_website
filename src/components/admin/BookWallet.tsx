import React, { useEffect, useState } from "react";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const userInfo = useSelector(
        (state: RootState) => state.user.userInfo?.user
    );
    const userId = userInfo?._id || "";

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const response = await adminAxiosInstance.get("/bookd-wallet");
                console.log(response?.data,'resoins')
                if (Array.isArray(response?.data) && response.data.length > 0) {
                    const walletData = response.data[0]; 
                    setBalance(walletData.balance); 
                    setWallet(walletData); 
                    console.log(walletData.balance);
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
    console.log(transactions,'transactions')

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
    console.log(transactions,'currentTransactions')

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    //  if (!wallet || !wallet.transactions) {
    //      return <div>Loading wallet transactions...</div>;
    //  }

    return (
        <div className="flex flex-col items-center py-4 bg-stone-800 min-h-screen rounded-xl ">
            <div className="mb-6 flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold text-white">Wallet</h1>
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
                <div className="w-3/4 p-3 ">
                    <div className="w-full overflow-x-auto">
                        <span className="text-lg font-semibold text-white">
                            Balance: {wallet.balance}₹
                        </span>
                        {currentTransactions.filter(
                            (transaction) => transaction.total_amount > 0
                        ).length > 0 ? (
                            <table className="min-w-full bg-stone-800">
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
                                                <td className="font-medium text-gray-700 text-sm text-left py-3">
                                                    ₹
                                                    {transaction.total_amount.toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td className="font-medium text-gray-700 text-sm text-left">
                                                    {transaction.source ===
                                                    "payment_to_lender"
                                                        ? "Payment"
                                                        : "Refund"}
                                                </td>
                                                <td className="font-medium text-gray-700 text-sm text-left">
                                                    {transaction.type ===
                                                    "credit"
                                                        ? "Credit"
                                                        : "Debit"}
                                                </td>
                                                <td className="font-medium text-gray-700 text-sm text-left">
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-500">
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
