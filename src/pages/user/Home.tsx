import React from 'react';
import { Route, Routes, Navigate} from 'react-router-dom';
import Header from '../../components/users/Header';
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
import Orders from '../../components/users/Orders';
import LendList from '../../components/users/LendList';
import RentList from '../../components/users/RentList';
import EditBookForm from '../../components/users/EditBookForm'; 
import AddBookForm from '../../components/users/AddBookForm';
import Footer from '../../components/users/Footer';

const Home: React.FC = () => {
    return (
        <div className='flex flex-col min-h-screen'>
                  <Header />    
                 <div className="flex-grow pt-16"> 
                    <div className='container mx-auto'>
                <Routes>
                    <Route path="/" element={<CenterOfHome />} />
                    <Route path="/*" element={<NestedRoutes />} />
                </Routes>
                <Footer />
         </div>
         </div>
         
        </div>
    );
};

const NestedRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/add-book" element={<AddBookForm />} />
                <Route path='/explore' element={<PrivateRoute><ExploreBooks /></PrivateRoute>} />
                <Route path="/profile/*" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                {/* <Route path="/chat/:receiverId" element={<PrivateRoute><Chat /></PrivateRoute>} /> */}
                <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />

                <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} />

                <Route path="/book/:id" element={<PrivateRoute><BookDetail /></PrivateRoute>} />
                <Route path="/payment-details/:cartId" element={<PrivateRoute><LenderDetails /></PrivateRoute>} />
                <Route path="/payment-success" element={<PrivateRoute><Successfull /></PrivateRoute>} />
                <Route path="/orders-list" element={<PrivateRoute><Orders /></PrivateRoute>} />
                <Route path="/lend-list" element={<PrivateRoute><LendList /></PrivateRoute>} />
                <Route path="/rent-list" element={<PrivateRoute><RentList /></PrivateRoute>} />
                <Route path='/edit-book/:bookId' element={<PrivateRoute><EditBookForm /></PrivateRoute>} />

                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </>
    );
};

export default Home;
