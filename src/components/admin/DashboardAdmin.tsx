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
    const [genreData, setGenreData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: "Books by Genre",
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
                const usersResponse = await adminAxiosInstance.get(
                    "/get-users"
                );
                const booksResponse = await adminAxiosInstance.get(
                    "/total-books"
                );
                setTotalUsers(usersResponse?.data?.length || 0);
                setTotalBooks(booksResponse?.data?.length || 0);
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
                const books = Array.isArray(booksResponse.data)
                    ? booksResponse.data
                    : [];
                const genreCount: { [genre: string]: number } = {};
                books.forEach((book: any) => {
                    const genre = book?.genre;
                    genreCount[genre] = (genreCount[genre] || 0) + 1;
                });

                const genreLabels = Object.keys(genreCount);
                const genreDataValues = Object.values(genreCount);

                const colors = genreLabels.map(() => {
                    const r = Math.floor(Math.random() * 255);
                    const g = Math.floor(Math.random() * 255);
                    const b = Math.floor(Math.random() * 255);
                    return `rgba(${r},${g},${b},0.6)`;
                });

                setGenreData({
                    labels: genreLabels,
                    datasets: [
                        {
                            label: "Books by Genre",
                            data: genreDataValues,
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
        <div className="bg-stone-800 shadow-md rounded p-4 h-full">
            <div className="container mx-auto">
                <h2 className="text-2xl font-serif mb-4 text-white">
                    Admin Dashboard
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-bold">Total Users</h3>
                        <p className="text-3xl">{totalUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-bold">Total Books</h3>
                        <p className="text-3xl">{totalBooks}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">

                <div className="bg-white p-4 rounded shadow w-full lg:w-1/2">
                        <h3 className="text-lg font-bold mb-4">Genres</h3>
                        <div className="flex justify-center">
                            <Pie
                                data={genreData}
                                options={{ maintainAspectRatio: false ,  responsive: true,}}
                                className="w-[200px] h-[250px] sm:w-[300px] sm:h-[350px] md:w-[400px] md:h-[450px] lg:w-[600px] lg:h-[500px]" 
                              
                            />
                            
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow w-full lg:w-1/2">
                        <h3 className="text-lg font-bold mb-4">User Growth</h3>
                        <div className="flex justify-center">
                            <Line
                                data={userGrowthData}
                                options={{ maintainAspectRatio: false,  responsive: true, }}
                                className="w-[200px] h-[250px] sm:w-[300px] sm:h-[350px] md:w-[400px] md:h-[450px] lg:w-[600px] lg:h-[500px]" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CenterAdmin;
