import React from 'react';
import { Route, Routes, Navigate,useLocation } from 'react-router-dom';
import Header from '../../components/users/Header';
import SideBar from '../../components/users/SideBar';
import CenterOfHome from '../../components/users/HomePage';
import Options from '../../components/users/Options';
import UserProfile from './UserProfile'
import PrivateRoute from '../../routes/PrivateRoute';
import ExploreBooks from '../../components/users/ExploreBooks';
import BookDetail from '../../components/users/BookDetail';
import Notifications from '../../components/users/Notifications';
import Chat from '../../components/users/Chat';
import MyBooks from '../../components/users/MyBooks';
import LenderDetails from '../../components/users/LenderDetails'
import Successfull from '../../components/users/Successfull';
import OrdersList from '../../components/users/OrdersList';

const Home: React.FC = () => {
    return (
        <div className='flex flex-col min-h-screen'>
                  <Header />    
                 <div className="flex-grow pt-16"> 
                    <div className='container mx-auto px-4'>
                <Routes>
                    <Route path="/" element={<CenterOfHome />} />
                    <Route path="/*" element={<NestedRoutes />} />
                </Routes>
         </div>
         </div>
         
        </div>
    );
};

const NestedRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add-book" element={<Options />} />
                <Route path='/explore' element={<PrivateRoute><ExploreBooks /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                {/* <Route path="/chat/:receiverId" element={<PrivateRoute><Chat /></PrivateRoute>} /> */}
                <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />

                <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} />

                <Route path="/book/:id" element={<PrivateRoute><BookDetail /></PrivateRoute>} />
                <Route path="/payment-details/:requestId" element={<PrivateRoute><LenderDetails /></PrivateRoute>} />
                <Route path="/payment-success" element={<PrivateRoute><Successfull /></PrivateRoute>} />
                <Route path="/orders-list" element={<PrivateRoute><OrdersList /></PrivateRoute>} />


                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </>
    );
};

export default Home;
