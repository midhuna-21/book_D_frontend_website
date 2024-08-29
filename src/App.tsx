import React ,{useEffect}from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import UserRouter from './routes/UserRouter';
import AdminRouter from './routes/AdminRoute';
import socket from './utils/socket/socket';
import {useSelector} from 'react-redux';
import {RootState} from './utils/ReduxStore/store/store';


function App() {

 
   return (
      <>
         <Toaster />
         <Router>
            <Routes>
               <Route path="/*" element={<UserRouter />} />
               <Route path="/admin/*" element={<AdminRouter />} />
            </Routes>
         </Router>
      </>
   );
}

export default App;
