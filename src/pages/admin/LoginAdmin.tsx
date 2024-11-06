import React from "react";
import signloginImage from "../../assets/signlogin.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addAdmin } from "../../utils/ReduxStore/slice/adminSlice";
import { axiosAdmin } from "../../utils/api/baseUrl";
import { isValidateLogin } from "../../utils/validations/loginValidation";

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        const validationResult = isValidateLogin(email, password);
        if (validationResult !== true) {
            toast.error(validationResult);
            return;
        }
try{
        const response = await axiosAdmin
            .post(
                "/login",
                {
                    email: email,
                    password: password,
                },
                { withCredentials: true }
            )
                if (response.status === 200) {
                    dispatch(addAdmin(response.data));
                    localStorage.setItem(
                        "adminaccessToken",
                        response.data.accessToken
                    );
                    localStorage.setItem(
                        "adminrefreshToken",
                        response.data.refreshToken
                    );
                    navigate("/admin/dashboard");
                }
            }catch(error:any) {
                if (
                    (error.response && error.response.status === 400) ||
                    error.response.status === 401
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occured try again later");
                }
            }
    };

    return (
        <div className="login min-h-screen flex items-center justify-center px-4">
            <div className="card flex flex-col md:flex-row border-gray-300 border-solid border-2 rounded-xl w-full md:w-1/2 overflow-hidden">
                <div
                    className="left flex-1 p-10 flex-col flex gap-7 text-white"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${signloginImage})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}>
                    <h1 className="text-5xl font-serif">Book.D</h1>
                    <p>
                        Discover your next great read with Book.D Whether you
                        want to rent or buy, our vast collection of books is at
                        your fingertips.
                    </p>
                </div>
                <div className="flex-1 flex flex-col gap-7 p-12">
                    <h1 className="text-3xl text-gray-700 mb-2 mt-3 font-serif text-center">
                        Login
                    </h1>

                    <form className="flex flex-col gap-5">
                        <input
                            type="text"
                            placeholder="Email"
                            className="border-b border-gray-300 px-5 py-3"
                            style={{ marginBottom: "5px" }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            className="border-b border-gray-300 px-5 py-3"
                            style={{ marginBottom: "5px" }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            className="w-1/2 px-4 py-2 justify-centert bg-gradient-to-r from-yellow-500 via-red-500 to-orange-500 font-bold cursor-pointer rounded-lg"
                            onClick={handleLogin}>
                            <p className="text-white">Login</p>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
