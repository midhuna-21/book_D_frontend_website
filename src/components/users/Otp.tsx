import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/ReduxStore/slice/userSlice";
import emailImage from "../../assets/emailImage.png";
import { toast } from "sonner";
import { axiosUser } from "../../utils/api/baseUrl";

const Otp: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const response =
        location.state?.response?.user || location.state?.response || "";
    const origin = location.state?.origin;
    const email = response.email;

    const [isSendOtp, setIsSendOtp] = useState(false);
    const [isOtpOnce, setIsOtpOnce] = useState(false);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);

    const otpGenerated = useRef(false);
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const handleChangeOtp = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value;
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < inputRefs.length - 1 && inputRefs[index + 1].current) {
                inputRefs[index + 1].current!.focus();
            }
        } else if (value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                inputRefs[index - 1].current!.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
            }
        }
    };

    const handleVerify = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        const otpValue = otp.join("");

        axiosUser
            .post("/verify-otp", { response, otp: otpValue, origin })
            .then((response) => {
                const { user } = response.data;
                if (origin === "sign-up") {
                    dispatch(addUser(response.data));
                    localStorage.setItem(
                        "useraccessToken",
                        response.data.accessToken
                    );
                    localStorage.setItem(
                        "userrefreshToken",
                        response.data.refreshToken
                    );

                    navigate("/home");
                    localStorage.removeItem("otpPageVisited");
                } else {
                 
                    navigate("/new-password", { state: { response: user } });
                    localStorage.setItem("otpSubmitted", "true");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, try again later");
                }
            });
    };

    useEffect(() => {
        window.history.replaceState(null, "");
    }, []);

    const handleResentOtp = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        if (isSendOtp) {
            return;
        }
        axiosUser
            .post("/otp-generate", { email })
            .then(() => {
                toast.success("OTP sent successfully");
                setIsSendOtp(true);
                setIsOtpOnce(true);
                startTimer();
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, try again later");
                }
            });
    };

    const startTimer = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
        }
        setTimer(60);

        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 0) {
                    clearInterval(interval);
                    setIsSendOtp(false);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
        intervalId.current = interval;
    };

    const generateOtp = async () => {
        try {
            if (!email) {
                return toast.error("An error occurred, please try again later");
            }
            axiosUser
                .post("/otp-generate", { email })
                .then(() => {
                    setIsSendOtp(true);
                    setIsOtpOnce(true);
                    startTimer();
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("An error occurred, try again later");
                    }
                });
        } catch (error: any) {
            console.log("Error generating OTP", error);
        }
    };

    // useEffect(() => {
    //     const emailEntered = localStorage.getItem("emailEntered");

    //     if (!emailEntered) {
    //         navigate("/forgot-password");
    //     } else {
    //         const handleBeforeUnload = () => {
    //             localStorage.setItem("otpPageReloaded", "true");
    //         };

    //         const handlePopState = () => {
    //             localStorage.removeItem("emailEntered");
    //             navigate("/forgot-password");
    //         };

    //         window.addEventListener("beforeunload", handleBeforeUnload);
    //         window.addEventListener("popstate", handlePopState);

    //         return () => {
    //             window.removeEventListener("beforeunload", handleBeforeUnload);
    //             window.removeEventListener("popstate", handlePopState);
    //         };
    //     }
    // }, [navigate]);

    useEffect(() => {
        const otpPageReloaded = localStorage.getItem("otpPageReloaded");

        if (otpPageReloaded) {
            localStorage.removeItem("otpPageReloaded");
            navigate("/forgot-password");
        } else {
            if (!response || !email) {
                navigate("/forgot-password");
            } else if (!otpGenerated.current) {
                generateOtp();
                otpGenerated.current = true;
            }
        }

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        };
    }, [response, email, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex border-gray-300 border-solid border-2 rounded-xl min-h-96 overflow-hidden">
                <div className="flex-1 flex flex-col gap-5 p-12">
                    <img
                        src={emailImage}
                        alt="Email Notification"
                        className="h-32 w-32 mx-auto opacity-75"
                    />
                    <h1 className="text-3xl text-gray-700 mb-2 mt-3 font-serif text-center">
                        OTP Verification
                    </h1>
                    <p className="text-gray-600 text-center mb-4 font-custom text-xs">
                        Please check your email for the OTP. Enter the code
                        below to verify your account.
                    </p>
                    <div className="flex justify-center items-center mb-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength={1}
                                placeholder="0"
                                value={digit}
                                className="border-b border-gray-300 px-5 py-3 w-16 text-center otp-input"
                                onChange={(e) => handleChangeOtp(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                style={{
                                    marginRight:
                                        index < otp.length - 1 ? "5px" : "0",
                                }}
                            />
                        ))}
                    </div>
                    {isSendOtp && (
                        <span
                            className="text-gray-500 text-center mb-4"
                            style={{ fontFamily: "serif" }}>
                            Resend OTP in {timer} seconds
                        </span>
                    )}
                    <div className="flex justify-center items-center gap-4">
                        <button
                            type="button"
                            className="w-32 h-10 bg-gradient-to-r from-yellow-500 via-red-500 to-orange-500 text-white font-bold text-xs cursor-pointer rounded-lg flex items-center justify-center"
                            onClick={handleResentOtp}
                            disabled={isSendOtp}
                            style={{ opacity: isSendOtp ? 0.5 : 1 }}>
                            <span>{isOtpOnce ? "Resend OTP" : "OTP"}</span>
                        </button>
                        <button
                            type="button"
                            className="w-32 h-10 bg-orange-700 text-white font-bold text-xs cursor-pointer rounded-lg flex items-center justify-center"
                            onClick={handleVerify}>
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Otp;
