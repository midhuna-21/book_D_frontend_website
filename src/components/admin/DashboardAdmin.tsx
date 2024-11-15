import React, { useEffect, useState } from "react";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import { Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

const CenterAdmin: React.FC = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalBooks, setTotalBooks] = useState(0);
    const [bookData, setBookData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: "Books orders",
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: [],
            },
        ],
    });
    const [userGrowthData, setUserGrowthData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: "User Growth",
                data: [],
                fill: false,
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await adminAxiosInstance.get("/users");
                const ordersResponse = await adminAxiosInstance.get("/orders");
                setTotalUsers(usersResponse?.data?.length || 0);
                setTotalBooks(ordersResponse?.data?.length || 0);
                const users = Array.isArray(usersResponse.data)
                    ? usersResponse.data
                    : [];
                const userCountByDate: { [date: string]: number } = {};

                users.forEach((user: any) => {
                    const createdAt = new Date(user.createdAt)
                        .toISOString()
                        .split("T")[0];
                    userCountByDate[createdAt] =
                        (userCountByDate[createdAt] || 0) + 1;
                });

                const labels = Object.keys(userCountByDate);
                const data = Object.values(userCountByDate);

                if (labels.length > 0 && data.length > 0) {
                    setUserGrowthData({
                        labels,
                        datasets: [
                            {
                                label: "User Growth",
                                data,
                                fill: false,
                                backgroundColor: "#4CAF50",
                                borderColor: "#4CAF50",
                                tension: 0.1,
                            },
                        ],
                    });
                }
                const orders = Array.isArray(ordersResponse.data)
                    ? ordersResponse.data
                    : [];
                const bookCount: { [book: string]: number } = {};
                orders.forEach((order: any) => {
                    const book = order?.bookTitle;
                    bookCount[book] = (bookCount[book] || 0) + 1;
                });

                const bookLabels = Object.keys(bookCount);
                const bookDataValues = Object.values(bookCount);

                const colors = bookLabels.map(() => {
                    const r = Math.floor(Math.random() * 255);
                    const g = Math.floor(Math.random() * 255);
                    const b = Math.floor(Math.random() * 255);
                    return `rgba(${r},${g},${b},0.6)`;
                });

                setBookData({
                    labels: bookLabels,
                    datasets: [
                        {
                            label: "Books orders",
                            data: bookDataValues,
                            backgroundColor: colors,
                            hoverBackgroundColor: colors.map((color: string) =>
                                color.replace("0.6", "0.8")
                            ),
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white shadow-md rounded p-4 min-h-screen">
            <div className="container">
                <h2 className="text-2xl font-serif mb-4 text-black">
                    Admin Dashboard
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded shadow-lg border-2">
                        <h3 className="text-lg font-bold">Total Users</h3>
                        <p className="text-3xl">{totalUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-lg border-2">
                        <h3 className="text-lg font-bold">Total Books</h3>
                        <p className="text-3xl">{totalBooks}</p>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="bg-white p-4 rounded shadow-lg border-2 w-full lg:w-1/2">
                        <h3 className="text-lg font-bold mb-4">Books</h3>
                        <div className="flex justify-center">
                            <Pie
                                data={bookData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                }}
                                className="w-[150px] h-[200px] sm:w-[200px] sm:h-[250px] md:w-[250px] lg:w-[300px] lg:h-[350px]"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow-lg border-2 w-full lg:w-1/2">
                        <h3 className="text-lg font-bold mb-4">User Growth</h3>
                        <div className="flex justify-center">
                            <Line
                                data={userGrowthData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                }}
                                className="w-[150px] h-[200px] sm:w-[200px] sm:h-[250px] md:w-[250px] lg:w-[300px] lg:h-[350px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CenterAdmin;
