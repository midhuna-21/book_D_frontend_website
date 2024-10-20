import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import signloginImage from "../../assets/signlogin.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/ReduxStore/slice/userSlice";
import { axiosUser } from "../../utils/api/baseUrl";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInButton from "../../utils/authentication/Googlebutton";
import { isValidateLogin } from "../../utils/validations/loginValidation";
import config from "../../config/config";

const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        const validationResult = isValidateLogin(email, password);
        if (validationResult !== true) {
            toast.error(validationResult);
            return;
        }

        axiosUser
            .post(
                "/login",
                {
                    email: email,
                    password: password,
                },
                { withCredentials: true }
            )
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(addUser(response.data));

                    localStorage.setItem(
                        "useraccessToken",
                        response.data.accessToken
                    );
                    localStorage.setItem(
                        "userrefreshToken",
                        response.data.refreshToken
                    );
                    navigate("/home", { replace: true });
                }
                window.history.replaceState(null, "");
            })
            .catch(function (error) {
                if (
                    (error.response && error.response.status === 400) ||
                    error.response.status === 401
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occured try again later");
                }
            });
    };
    useEffect(() => {
        window.history.replaceState(null, "");
    }, []);

    return (
        <div className="login min-h-screen grid items-center justify-center px-5 py-3">
            <div className="card flex flex-col md:flex-row border-gray-300 border-solid border-2 rounded-xl overflow-hidden w-full max-w-2xl h-10/12 md:h-/7 ">
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
                    <span className="text-xs">Don't you have an account?</span>
                    <Link to="/">
                        <button className="w-1/2 px-4 py-2 text-gray-700 bg-white font-medium cursor-pointer mt-8 rounded-lg">
                            Sign up
                        </button>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col gap-7 p-12">
                    <h1 className="text-3xl text-gray-700 mb-2 mt-3 font-serif text-center">
                        Login
                    </h1>
                    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
                        <SignInButton />
                    </GoogleOAuthProvider>
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
                        <Link to="/forgot-password?access=true">
                            <span className="text-xs text-blue-600">
                                Forgot Password?
                            </span>
                        </Link>
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

export default UserLogin;
