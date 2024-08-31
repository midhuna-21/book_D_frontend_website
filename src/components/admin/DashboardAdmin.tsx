import React, { useEffect, useState } from 'react';
import { adminAxiosInstance } from '../../utils/api/axiosInstance';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const CenterAdmin: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRentedBooks, setTotalRentedBooks] = useState(0);
  const [totalSoldBooks, setTotalSoldBooks] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [userGrowthData, setUserGrowthData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'User Growth',
        data: [],
        fill: false,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
      },
    ],
  });

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await adminAxiosInstance.get('/get-users');
        const rentedBooksResponse = await adminAxiosInstance.get('/total-rented-books');
        const soldBooksResponse = await adminAxiosInstance.get('/total-sold-books');
        const booksResponse = await adminAxiosInstance.get('/total-books');

        const userss = usersResponse?.data?.length;
        const rentedBooks = rentedBooksResponse?.data?.length;
        const soldBooks = soldBooksResponse?.data?.length;
        const totalBooks = booksResponse?.data?.length;
        setTotalUsers(userss);
        setTotalRentedBooks(rentedBooks);
        setTotalSoldBooks(soldBooks);
        setTotalBooks(totalBooks);

        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const userCountByDate: { [date: string]: number } = {};
        
        users.forEach((user: any) => {
          const createdAt = new Date(user.createdAt).toISOString().split('T')[0]; 
          userCountByDate[createdAt] = (userCountByDate[createdAt] || 0) + 1;
        });
        
        const labels = Object.keys(userCountByDate);
        const data = Object.values(userCountByDate);
       
        
        if (labels.length > 0 && data.length > 0) {
          setUserGrowthData({
            labels,
            datasets: [
              {
                label: 'User Growth',
                data:data,
                fill: false,
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
              },
            ],
          });
        }
  
        console.log(userGrowthData,'growhdat')

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const pieData = {
    labels: ['Rented Books', 'Sold Books'],
    datasets: [
      {
        label: 'Books',
        data: [totalRentedBooks, totalSoldBooks],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };



  return (
    <div className="bg-stone-800 shadow-md rounded p-4 h-full">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Users</h3>
            <p className="text-3xl">{totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Rented Books</h3>
            <p className="text-3xl">{totalRentedBooks}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Sold Books</h3>
            <p className="text-3xl">{totalSoldBooks}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Books</h3>
            <p className="text-3xl">{totalBooks}</p>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="bg-white p-4 rounded shadow w-1/3">
            <h3 className="text-lg font-bold mb-4">Books</h3>
            <div className="flex justify-center">
              <Pie data={pieData} height={100} width={100} />
            </div>
          </div>
          {/* <div className="bg-white p-4 rounded shadow w-1/3">
            <h3 className="text-lg font-bold mb-4">Users</h3> */}
            {/* <div className="flex justify-center">
              <Line data={userGrowthData} height={100} width={100} />
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default CenterAdmin;
