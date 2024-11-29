import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import UserSignUp from "../pages/user/UserRegister";
import UserLogin from "../pages/user/UserLogin";
import ForgotPassword from "../components/users/ForgotPassword";
import NewPassword from "../components/users/NewPassword";
import Otp from "../components/users/Otp";
import ResetPassword from "../components/users/ResetPassword";
import Error from "../components/users/Error";
import LinkGoogleAccount from "../components/users/LinkGooleEmail";
import Header from "../components/users/Header";
import CenterOfHome from "../components/users/HomePage";
import DetailsOfLending from '../components/users/DetailsOfLending'
import DetailsOfRenting from '../components/users/DetailsOfRenting'
import UserAccountProfile from "../pages/user/UserProfile";
import ExploreRentalBooks from "../components/users/ExploreBooks";
import BookDetailPage from "../components/users/BookDetail";
import UserNotifications from "../components/users/Notifications";
import UserChat from "../components/users/Chat";
import UserLendBooks from "../components/users/MyBooks";
import Rent from "../components/users/Rent";
import Lend from "../components/users/Lend";
import OrderDetail from "../components/users/OrderDetail";
import LendOrderDetailPage from "../components/users/DetailPage";
import RentalPaymentDetails from "../components/users/LenderDetails";
import PaymentSuccess from "../components/users/Successfull";
import Orders from "../components/users/Orders";
import EditBookForm from "../components/users/EditBookForm";
import LendBookForm from "../components/users/AddBookForm";
import Footer from "../components/users/Footer";
import WalletTransactions from "../components/users/Wallet";

const UserRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <UserSignUp />
                    </PublicRoute>
                }
            />
            <Route
                path="/verify-otp"
                element={
                    <PublicRoute>
                        <Otp />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <UserLogin />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/password/update"
                element={
                    <PublicRoute>
                        <NewPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/google-link-password"
                element={
                    <PublicRoute>
                        <LinkGoogleAccount />
                    </PublicRoute>
                }
            />

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
                path="*"
                element={
                    <PrivateRoute>
                        <>
                            <Header />
                            <div className="flex flex-col">
                                <Routes>
                                    <Route
                                        path="/home"
                                        element={<CenterOfHome />}
                                    />

                                    <Route
                                        path="/how-lending-works"
                                        element={
                                            <PrivateRoute>
                                                <DetailsOfLending/>
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/how-renting-works"
                                        element={
                                            <PrivateRoute>
                                                <DetailsOfRenting />
                                            </PrivateRoute>
                                        }
                                    />
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
                                        path="/books/update/:bookId"
                                        element={
                                            <PrivateRoute>
                                                <EditBookForm />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/*"
                                        element={
                                            <PrivateRoute>
                                                <UserAccountProfile />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/wallet"
                                        element={
                                            <PrivateRoute>
                                                <WalletTransactions />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/lend-books"
                                        element={
                                            <PrivateRoute>
                                                <UserLendBooks />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/books/lend"
                                        element={
                                            <PrivateRoute>
                                                <Lend />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/books/rent"
                                        element={
                                            <PrivateRoute>
                                                <Rent />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/books/rent/order-detail/:orderId"
                                        element={
                                            <PrivateRoute>
                                                <OrderDetail />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/books/lend/order-detail/:orderId"
                                        element={
                                            <PrivateRoute>
                                                <LendOrderDetailPage />
                                            </PrivateRoute>
                                        }
                                    />
                                </Routes>
                            </div>
                            <Footer />
                        </>
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<Error />} />
        </Routes>
    );
};
export default UserRouter;
