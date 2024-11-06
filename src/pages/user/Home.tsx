import React from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import Header from "../../components/users/Header";
import CenterOfHome from "../../components/users/HomePage";
import UserAccountProfile from "./UserProfile";
import PrivateRoute from "../../routes/PrivateRoute";
import ExploreRentalBooks from "../../components/users/ExploreBooks";
import BookDetailPage from "../../components/users/BookDetail";
import UserNotifications from "../../components/users/Notifications";
import UserChat from "../../components/users/Chat";
import UserLendBooks from "../../components/users/MyBooks";
import RentalPaymentDetails from "../../components/users/LenderDetails";
import PaymentSuccess from "../../components/users/Successfull";
import Orders from "../../components/users/Orders";
import LendedBooks from "../../components/users/LendList";
import RentedBooks from "../../components/users/RentList";
import EditBookForm from "../../components/users/EditBookForm";
import LendBookForm from "../../components/users/AddBookForm";
import Footer from "../../components/users/Footer";
import WalletTransactions from "../../components/users/Wallet";
import { ProfileProtectRoute } from "../../routes/ProfilePrivateRoute";

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow pt-16">
                <div className="container mx-auto">
                    <Routes>
                        <Route path="/home" element={<CenterOfHome />} />
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
                <Route
                    path="/lend-book"
                    element={
                        <PrivateRoute>
                            <LendBookForm />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/explore-books"
                    element={
                        <PrivateRoute>
                            <ExploreRentalBooks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <PrivateRoute>
                            <UserNotifications />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <PrivateRoute>
                            <UserChat />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/book/:id"
                    element={
                        <PrivateRoute>
                            <BookDetailPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/payment/rental-details/:cartId"
                    element={
                        <PrivateRoute>
                            <RentalPaymentDetails />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/payment/success"
                    element={
                        <PrivateRoute>
                            <PaymentSuccess />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/orders-list"
                    element={
                        <PrivateRoute>
                            <Orders />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/books/lend"
                    element={
                        <PrivateRoute>
                            <LendedBooks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/books/rent"
                    element={
                        <PrivateRoute>
                            <RentedBooks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/books/update/:bookId"
                    element={
                        <PrivateRoute>
                            <EditBookForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/:username/*"
                    element={
                        <PrivateRoute>
                            <ProfileProtectRoute
                                children={UserAccountProfile}
                            />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/:username/wallet"
                    element={
                        <PrivateRoute>
                            <ProfileProtectRoute
                                children={WalletTransactions}
                            />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/:username/lend-books"
                    element={
                        <PrivateRoute>
                            <ProfileProtectRoute children={UserLendBooks} />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default Home;
