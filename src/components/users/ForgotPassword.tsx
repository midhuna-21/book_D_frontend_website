import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sitelogo from "../../assets/siteLogo.png";
import security from "../../assets/security-lock-icon-29.jpg";
import { useState } from "react";
import { axiosUser } from "../../utils/api/baseUrl";
import { toast } from "sonner";
import { validateEmail } from "../../utils/validations/forgotEmail";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmitEmail = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        const validationResult = validateEmail(email);
        if (validationResult !== true) {
            toast.error(validationResult);
            return;
        }
        try {
            const response = await axiosUser.post("/send-otp/password-reset", {
                email: email,
            });

            toast.success("Email sent successfully.Check your email.");
            navigate("/verify-otp", {
                state: {
                    response: response.data.isValidEmail,
                },
                replace: true,
            });
            window.history.replaceState(null, "");
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occured try again later");
            }
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("access") !== "true") {
            navigate("/login", { replace: true });
        }
    }, [location, navigate]);
    return (
        <div className="forgot flex items-center justify-center min-h-screen px-4 sm:px-6">
            <div className="border-2 border-gray-300 rounded-lg relative flex items-center justify-center max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full">
                <div
                    style={{ height: "500px", width: "100%" }}
                    className="p-6 sm:p-8 md:p-10 lg:p-12 bg-white bg-opacity-40 border border-gray-300 rounded w-full">
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
                    <p className="mb-4 font-sans">
                        To reset your password, enter your email below.
                    </p>

                    <form>
                        <label className="block mb-2">
                            Email Address
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-400 rounded w-full"
                            />
                        </label>

                        {/* {!isEmailSubmitted ? ( */}
                        <button
                            type="button"
                            className="w-32 h-10 bg-gradient-to-r from-yellow-500 via-red-500 to-orange-500 text-white font-bold text-xs cursor-pointer rounded-lg mt-4 flex items-center justify-center"
                            onClick={handleSubmitEmail}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
