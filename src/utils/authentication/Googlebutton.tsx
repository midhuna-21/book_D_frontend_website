import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { addUser } from "../ReduxStore/slice/userSlice";
import googleimage from "../../assets/google.png";
import { axiosUser } from "../api/baseUrl";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const SignInButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLoginRoute = location.pathname === "/login";

    const signin = useGoogleLogin({
        onSuccess: async (credentialResponse: any) => {
            try {
                const response = await axios.get(
                    "https://www.googleapis.com/oauth2/v1/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${credentialResponse.access_token}`,
                        },
                    }
                );


                if (response && response.data) {
                    const data = {
                        name: response.data.name,
                        email: response.data.email,
                        image: response.data.picture,
                    }
                    try {
                        const res = await axiosUser.post("/google-login", data,{ withCredentials: true });
    
                        if (res.status === 200) {
                            dispatch(addUser(res.data));
    
                            localStorage.setItem(
                                "useraccessToken",
                                res.data.accessToken
                            );
                            localStorage.setItem(
                                "userrefreshToken",
                                res.data.refreshToken
                            );
    
                            navigate("/home");
                        }
                    } catch (innerError: any) {
                        if (innerError.response && innerError.response.status === 400) {
                            toast.error(innerError.response.data.message);
                            navigate("/google-link-password", {
                                state: { email: response.data.email },
                            });
                        } else if (
                            innerError.response &&
                            (innerError.response.status === 500 || innerError.response.status === 401)
                        ) {
                            toast.error(innerError.response.data.message);
                        } else {
                            console.error("Unexpected error in inner API call:", innerError.message);
                        }
                    }
                }

                    // await axiosUser
                    //     .post("/google-login", {
                    //         name: response.data.name,
                    //         email: response.data.email,
                    //         image: response.data.picture,
                    //     }
                    // )
                    //     .then(function (response) {
                    //         if (response.status == 200) {
                    //             dispatch(addUser(response.data));

                    //             localStorage.setItem(
                    //             "useraccessToken",
                    //             response.data.accessToken
                    //         );
                    //         localStorage.setItem(
                    //             "userrefreshToken",
                    //             response.data.refreshToken
                    //         );
                    //         navigate("/home");
                    //     }
                    // })
                    // .catch(function (error) {
                    //     if (error.response && error.response.status === 400) {
                    //         toast.error(error.response.data.message);
                    //         navigate("/google-link-password", {
                    //             state: { email: response.data.email },
                    //         });
                    //     }

                    //     if (
                    //         (error.response && error.response.status === 500) ||
                    //         error.response.status === 401
                    //     ) {
                    //         toast.error(error.response.data.message);
                    //     }
                    // });
                }catch (outerError: any) {
                   
                    console.error("Error fetching Google user data:", outerError.message);
                }
            },
            onError: (error) => {
                console.error("Login Failed:", error);
            },
    });

    return (
        <div className="flex justify-center mb-3 md:mb-4">
            <button
                className="w-full max-w-2xl h-full md:h-10 flex items-center justify-center bg-white-700 border border-black text-black font-bold cursor-pointer rounded-md hover:rounded-3xl"
                onClick={() => signin()}>
                <img
                    src={googleimage}
                    className="w-5 h-5 rounded-full object-fill"
                    alt=""
                />
                <p className="ml-2 font-light">
                    {" "}
                    {isLoginRoute
                        ? "Login with Google"
                        : "Sign up with Google"}{" "}
                </p>
            </button>
        </div>
    );
};

export default SignInButton;
