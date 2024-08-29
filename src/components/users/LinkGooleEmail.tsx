import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosUser } from "../../utils/api/baseUrl";
import { toast } from "react-toastify";
import {addUser} from '../../utils/ReduxStore/slice/userSlice';
import { useDispatch } from "react-redux";
import sitelogo from "../../assets/siteLogo.png";
import security from "../../assets/security-lock-icon-29.jpg";
import { HiEye, HiEyeOff } from "react-icons/hi";

const LinkGoogleEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const { email } = location.state || {};
    const dispatch = useDispatch()
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

       
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }


        try {
            const response = await axiosUser.post("/link-google-account", { email, password });

            if (response.status === 200) {
                toast.success("Your account has been successfully linked!");
                dispatch(addUser(response.data))
   console.log('hkome')
                navigate("/home");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error("Incorrect password. Please try again.");
            } else {
                toast.error("An error occurred, please try again later.");
            }
        }
    };

    return (
        <div className="forgot h-[100vh] flex items-center justify-center">
            <div
                style={{ height: "500px", width: "600px" }}
                className="border-2 border-gray-500 rounded-lg relative flex items-center justify-center"
            >
                <div
                    style={{ height: "500px", width: "600px" }}
                    className="p-6 absolute bg-white bg-opacity-40 border border-gray-300 rounded"
                >
                    <div className="flex items-center mb-5">
                        <img src={sitelogo} alt="Icon" className="h-20 w-35 mr-2" />
                        <h1 className="text-5xl font-serif">Book.D</h1>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <img src={security} alt="Icon" className="h-5 w-5 mr-2" />
                        <h2 className="text-xl mb-2 font-normal">Link Your Google Account</h2>
                    </div>
                    <p className="mb-4 font-sans">
                        Your email is not linked with your Book.D account. If you want to link it with your account, please enter your password.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2 font-mono">
                            Password
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    className="mt-1 p-2 border border-gray-400 rounded w-full"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3"
                                    onClick={togglePasswordVisibility}
                                >
                                    {isPasswordVisible ? <HiEyeOff /> : <HiEye />}
                                </button>
                            </div>
                        </label>
                        <label className="block mb-2 font-mono">
                            Confirm Password
                            <input
                                type="password"
                                className="mt-1 p-2 border border-gray-400 rounded w-full"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-32 h-10 bg-gradient-to-r from-yellow-500 via-red-500 to-orange-500 text-white font-bold text-xs cursor-pointer rounded-lg mt-4 flex items-center justify-center"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LinkGoogleEmail;
