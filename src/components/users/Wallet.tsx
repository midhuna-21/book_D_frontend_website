import React, { useEffect, useState } from "react";
import walletImgage from "../../assets/wallet.png";
import { motion } from "framer-motion";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { toast } from "sonner";

interface ITransaction {
    type: "credit" | "debit";
    total_amount: number;
    source: string;
    orderId: IOrder;
    createdAt: Date;
}

interface IWallet {
    _id: string;
    wallet: string;
    balance: number;
    transactions: ITransaction[];
}

interface IOrder {
    _id: string;
    bookTitle: string;
}
const WalletTransactions: React.FC = () => {
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
                const response = await userAxiosInstance.get(
                    "/wallet/transactions"
                );
                if (response?.data?.wallet) {
                    console.log(response, "responsee wallet");
                    setBalance(response?.data?.wallet?.balance);
                    setWallet(response.data.wallet);
                } else {
                    console.error("Wallet data not found in the response");
                }
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, please try again later");
                    console.error("Error fetching wallet data:", error);
                }
            }
        };
        fetchWalletData();
    }, [userId]);

    const transactions = wallet?.transactions ?? [];

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
    // console.log(currentTransactions,'currentTransactions')

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    if (!wallet || !wallet.transactions) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.img
                    src={walletImgage}
                    alt="Empty Wallet"
                    className="w-66 h-56 mb-4"
                    // animate={{
                    //     y: [0, -10, 0],
                    // }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                />
                <div className="text-center">
                    <p className="text-gray-600 text-md font-semibold">
                        Empty wallet?
                    </p>
                    <p className="text-gray-600 text-md font-semibold">
                        Share your books and earn extra money!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center py-24 bg-gray-100 min-h-screen">
            <div className="mb-6 flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold text-gray-700">Wallet</h1>
                <p className="text-sm text-gray-600 mt-2">
                    {currentTransactions.length === 0 && balance === 0 ? (
                        <span>
                            No transactions available. Please check back later.
                            <span className="text-red-500 font-bold text-lg ml-1">
                                !
                            </span>
                        </span>
                    ) : (
                        "Manage your wallet, track your transactions, and explore your books."
                    )}
                </p>
            </div>

            {wallet && (
                <>
                    <div className="w-full md:w-3/4 p-3 min-h-[60vh]">
                        {currentTransactions.filter(
                            (transaction) => transaction.total_amount > 0
                        ).length > 0 ? (
                            <div className="w-full overflow-x-auto">
                                <span>Balance: {wallet.balance}₹</span>
                                <table className="min-w-full w-full">
                                    <thead>
                                        <tr>
                                            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Book Title
                                            </th>
                                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Source
                                            </th>
                                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                    key={
                                                        transaction.orderId?._id
                                                    }
                                                    className="odd:bg-white even:bg-gray-50 border-b">
                                                    <td className="py-4 font-medium text-gray-700 text-sm text-left">
                                                        {
                                                            transaction.orderId
                                                                ?.bookTitle
                                                        }
                                                    </td>
                                                    <td className="px- py- font-medium text-gray-700 text-sm text-left">
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
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                Wallet is empty
                            </div>
                        )}
                    </div>

                    <div
                        className="px-12 flex items-center justify-center"
                        style={{ height: "200px" }}>
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-gray-700 rounded disabled:opacity-50">
                            <FaLessThan />
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-3 py-1 mx-1 rounded ${
                                        currentPage === page
                                            ? "bg-cyan-800 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}>
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-gray-700 rounded disabled:opacity-50">
                            <FaGreaterThan />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default WalletTransactions;
