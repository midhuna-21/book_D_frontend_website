import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import sitelogo from "../../assets/siteLogo.png";
import {useSelector,useDispatch} from 'react-redux';
import {RootState} from '../../utils/ReduxStore/store/store';
import {clearUser} from '../../utils/ReduxStore/slice/userSlice';
import { HiEye, HiEyeOff } from "react-icons/hi";
import security from "../../assets/security-lock-icon-29.jpg";
import { useState } from "react";
import { axiosUser } from "../../utils/api/baseUrl";
import { toast } from "sonner";
import { isValidatePasswords } from "../../utils/validations/new-password";

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState("");
    const [conformPassword, setConformPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const user= useSelector((state:RootState)=>state?.user?.userInfo?.user)
   
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const searchParams = new URLSearchParams(location.search);
    const email = location.state?.response?.email || searchParams.get("email");
    const resetToken = searchParams.get("token");
    const token = user?.resetToken
    console.log(token)
    const resetTokenExpiration = searchParams.get('expires')  

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const handleSubmit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        if (!password.trim()) {
            toast.error("Please enter password");
            return;
        }
        const validationResult = isValidatePasswords(password, conformPassword);
        if (validationResult !== true) {
            toast.error(validationResult);
            return;
        }

        axiosUser
            .post("/update-password", {
               resetToken,
                resetTokenExpiration,
                email: email,
                password: password,
            })
            .then(function () {
                localStorage.removeItem("useraccessToken");
                localStorage.removeItem("userrefreshToken");
                dispatch(clearUser());
            //    dispatch(addUser(response.data))
            toast.success("successfully unlinked your email account.")
                navigate("/login", { replace: true });
                localStorage.removeItem("otpSubmitted");
            })
            .catch(function (error) {
                if (error.response && error.response.status === 401) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occured try again later");
                }
            });
    };   

    useEffect(() => {
        const otpSubmitted = localStorage.getItem("otpSubmitted");       
        const email = searchParams.get("email");

      
        if (resetToken && email) { 
         const currentTime = Date.now()
         console.log(token,'resetToken')
         if(resetTokenExpiration && currentTime > parseInt(resetTokenExpiration,10) || token==null){
            navigate('/error',{state:{error: 'Token expired', from: location.pathname }})
            return 
         }
         return;
        }

        if (!otpSubmitted) {
            navigate("/forgot-password");
        } else {
            const handleBeforeUnload = () => {
                localStorage.removeItem("otpSubmitted");
            };

            window.addEventListener("beforeunload", handleBeforeUnload);

            return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload);
            };
        }
    }, [navigate, location.search]);

    return (
        <div className="forgot h-[100vh] flex items-center justify-center">
            <div
                style={{ height: "500px", width: "600px" }}
                className="border-2 border-gray-500 rounded-lg relative flex items-center justify-center">
                {/* <div className='absolute inset-0 bg-white opacity-50'></div> */}
                <div
                    style={{ height: "500px", width: "600px" }}
                    className=" p-6 absolute bg-white bg-opacity-40 border border-gray-300 rounded">
                    <div className="flex items-center mb-5 ">
                        <img
                            src={sitelogo}
                            alt="Icon"
                            className="h-20 w-35 mr-2"
                        />
                        <h1 className="text-5xl font-serif">Book.D</h1>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={security}
                            alt="Icon"
                            className="h-5 w-5 mr-2"
                        />
                        <h2 className="text-xl mb-2 font-normal">
                            Reset your password
                        </h2>
                    </div>
                    {/* <p className="mb-4 font-sans">
                        To reset your password, enter your email below.
                    </p> */}

                    <form>
                        <label className="block mb-2 font-mono">
                            New Password
                            <div className="relative">
                                <input
                                    type={
                                        isPasswordVisible ? "text" : "password"
                                    }
                                    className="mt-1 p-2 border border-gray-400 rounded w-full"
                                    style={{ marginBottom: "5px" }}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3"
                                    onClick={togglePasswordVisibility}>
                                    {isPasswordVisible ? (
                                        <HiEyeOff />
                                    ) : (
                                        <HiEye />
                                    )}
                                </button>
                            </div>
                        </label>
                        <label className="block mb-2 font-mono">
                            Conform Password
                            <input
                                type="password"
                                className="mt-1 p-2 border border-gray-400 rounded w-full"
                                style={{ marginBottom: "5px" }}
                                autoComplete="new-password"
                                value={conformPassword}
                                onChange={(e) =>
                                    setConformPassword(e.target.value)
                                }
                            />
                        </label>
                        <button
                            type="button"
                            className="w-32 h-10 bg-gradient-to-r from-yellow-500 via-red-500 to-orange-500 text-white font-bold text-xs cursor-pointer rounded-lg mt-7 flex items-center justify-center"
                            onClick={handleSubmit}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
