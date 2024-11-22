// import React from "react";
// import { Route, Routes, Navigate, useParams } from "react-router-dom";
// import Header from "../../components/users/Header";
// import CenterOfHome from "../../components/users/HomePage";
// import UserAccountProfile from "./UserProfile";
// import PrivateRoute from "../../routes/PrivateRoute";
// import ExploreRentalBooks from "../../components/users/ExploreBooks";
// import BookDetailPage from "../../components/users/BookDetail";
// import UserNotifications from "../../components/users/Notifications";
// import UserChat from "../../components/users/Chat";
// import UserLendBooks from "../../components/users/MyBooks";
// import Rent from "../../components/users/Rent";
// import Lend from "../../components/users/Lend";
// import OrderDetail from '../../components/users/OrderDetail';
// import LendOrderDetailPage from '../../components/users/DetailPage';
// import RentalPaymentDetails from "../../components/users/LenderDetails";
// import PaymentSuccess from "../../components/users/Successfull";
// import Orders from "../../components/users/Orders";
// import EditBookForm from "../../components/users/EditBookForm";
// import LendBookForm from "../../components/users/AddBookForm";
// import Footer from "../../components/users/Footer";
// import WalletTransactions from "../../components/users/Wallet";
// // import { ProfileProtectRoute } from "../../routes/ProfilePrivateRoute";
// import Error from "../../components/users/Error";

// const Home: React.FC = () => {
//     return (
//         <>
//             <Header />
//             <div className="flex flex-col">
//                 <Routes>
//                     <Route path="/home" element={<CenterOfHome />} />
//                     {/* <Route path="/*" element={<NestedRoutes />} /> */}
//                 </Routes>
                
//             </div>  
//             <Footer />
//         </>
//     );
// };

// // const NestedRoutes: React.FC = () => {
// //     return (
// //         <>
// //             <Routes>
// //                 <Route
// //                     path="/lend-book"
// //                     element={
// //                         <PrivateRoute>
// //                             <LendBookForm />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/explore-books"
// //                     element={
// //                         <PrivateRoute>
// //                             <ExploreRentalBooks />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/notifications"
// //                     element={
// //                         <PrivateRoute>
// //                             <UserNotifications />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                  <Route
// //                     path="/chat"
// //                     element={
// //                         <PrivateRoute>
// //                             <UserChat />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/book/:id"
// //                     element={
// //                         <PrivateRoute>
// //                             <BookDetailPage />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/payment/rental-details/:cartId"
// //                     element={
// //                         <PrivateRoute>
// //                             <RentalPaymentDetails />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/payment/success"
// //                     element={
// //                         <PrivateRoute>
// //                             <PaymentSuccess />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/orders-list"
// //                     element={
// //                         <PrivateRoute>
// //                             <Orders />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/books/update/:bookId"
// //                     element={
// //                         <PrivateRoute>
// //                             <EditBookForm />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/profile/*"
// //                     element={
// //                         <PrivateRoute>
// //                             <UserAccountProfile />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/profile/wallet"
// //                     element={
// //                         <PrivateRoute>
// //                             <WalletTransactions />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/profile/lend-books"
// //                     element={
// //                         <PrivateRoute>
// //                             <UserLendBooks />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/profile/books/lend"
// //                     element={
// //                         <PrivateRoute>
// //                             <Lend />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 <Route
// //                     path="/profile/books/rent"
// //                     element={
// //                         <PrivateRoute>
// //                             <Rent />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                  <Route
// //                     path="/profile/books/rent/order-detail/:orderId"
// //                     element={
// //                         <PrivateRoute>
// //                             <OrderDetail />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                    <Route
// //                     path="/profile/books/lend/order-detail/:orderId"
// //                     element={
// //                         <PrivateRoute>
// //                             <LendOrderDetailPage />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //                 {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
// //                 <Route path="*" element={<Error />} />

// //             </Routes>
// //         </>
// //     );
// // };

// export default Home;
