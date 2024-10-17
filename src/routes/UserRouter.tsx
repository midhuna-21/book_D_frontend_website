import { Route, Routes,Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import UserSignUp from '../pages/user/SignUp';
import UserLogin from '../pages/user/Login';
import Home from '../pages/user/Home';
import ForgotPassword from '../components/users/ForgotPassword';
import NewPassword from '../components/users/NewPassword';
import Otp from '../components/users/Otp';
import { RootState } from '../utils/ReduxStore/store/store';
import {useSelector} from 'react-redux';
import ResetPassword from '../components/users/ResetPassword'
import Error from '../components/users/Error';
import LinkGoogleEmail from '../components/users/LinkGooleEmail';

const UserRouter = () => {
  
    return (
        <Routes>
            <Route path='/' element={<PublicRoute><UserSignUp /></PublicRoute>} />
            <Route path='/otp-verification' element={<PublicRoute><Otp /></PublicRoute>} />
            <Route path='/login' element={<PublicRoute><UserLogin /></PublicRoute>} />
            <Route path='/forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path='/new-password' element={<PublicRoute><NewPassword /></PublicRoute>} />
            <Route path='/enter-password' element={<PublicRoute><LinkGoogleEmail /></PublicRoute>} />
            
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/error' element={<Error />} />

            <Route path='/home/*' element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
    );
};

export default UserRouter;
