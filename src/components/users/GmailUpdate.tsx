import React, { useState, useEffect, ChangeEvent } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../utils/ReduxStore/store/store";
import googleimage from "../../assets/google.png";
import { toast } from "sonner";
import { addUser } from "../../utils/ReduxStore/slice/userSlice";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import {validate} from '../../utils/validations/profile-validation';


const GmailUpdate: React.FC = () => {
    const user = useSelector((state: RootState) => state?.user?.userInfo?.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [linkClicked, setLinkClicked] = useState(false);
    const [message, setMessage] = useState<string>("Your Book.D account is currently linked to your Google account. If you unlink these accounts, then your password will be reset and you will be able to change your email address.");
const [messageType, setMessageType] = useState<'success' | 'info' | null>(null);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const openModal = () => {
      setIsModalOpen(true);
 
  };
  const closeModal = () => {
   setIsModalOpen(false);
  
};

  const handleLinkClick = async (e: React.FormEvent) => {
        e.preventDefault();
        openModal()
    };  
    const handleUnlinkConfirm = async()=>{
      const response = await userAxiosInstance.post('/send-email',{withCredentials:true})
      .then((response)=>{
         if(response.status==200){
            dispatch(addUser(response.data))
            setMessage("Check your email. We've sent a reset password link.");
            setMessageType('success');
            // navigate('/home/profile')
            closeModal()
         }
      }).catch((error)=>{
         console.log("Error")
         setMessage("An error occurred. Please try again.");
         setMessageType('info');
      })
    }

    return (
  <>
               <div className="bg-white rounded-lg shadow-xl p-7 w-2/3 h-full ">
               <h2 className="text-s font-bold mb-5 text-gray-700 ">Email Address</h2>
               {message && (
                <div
                    className={`p-3 mb-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                >
                    {message}
                </div>
            )}
               <div>
                   <input
                       type="email"
                       id="email"
                       name="email"
                       value={user?.email || ""}
                       className="w-full rounded-lg bg-gray-100 border border-gray-300 p-2 h-9"
                       required
                       disabled={Boolean(user?.email)}
                   />
                   <button
                       className="flex items-center justify-center mt-7 p-2 bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-semibold text-xs hover:bg-white hover:shadow-sm"
                       onClick={handleLinkClick}
                   >
                       <img
                           src={googleimage}
                           className="w-5 h-5 rounded-full object-fill mr-2"
                           alt="Google"
                       />
                       Unlink from Google
                   </button>
               </div>
           </div>

           {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-7 w-1/2">
                        <h2 className="text-xl font-bold mb-4">Unlink Your Google Account</h2>
                        <p className="text-gray-700 mb-6">
                            Please confirm that you would like to unlink your account. If you proceed, we'll send an email to <strong>{user?.email}</strong> with instructions for resetting your Book.D account password.
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-3"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                onClick={handleUnlinkConfirm}
                            >
                                Confirm Unlink
                            </button>
                        </div>
                    </div>
                </div>
            )}
           </>
    );
};

export default GmailUpdate