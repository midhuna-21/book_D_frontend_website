import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import signloginImage from "../../assets/signlogin.png";
import { validate } from "../../utils/validations/signupValidation";
import { axiosUser } from "../../utils/api/baseUrl";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInButton from "../../utils/authentication/Googlebutton";
import config from "../../config/config";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleRegister = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        const validationResult = validate(
            name,
            email,
            phone,
            password,
            confirmPassword
        );
        if (validationResult !== true) {
            toast.error(validationResult);
            return;
        }

        axiosUser
            .post(
                "/sign-up",
                {
                    name: name,
                    email: email,
                    phone: phone,
                    password: password,
                },
                { withCredentials: true }
            )
            .then(function (response) {
                if (response.status === 200) {
                    navigate("/otp-verification", {
                        state: { response: response.data },
                    });
                    // localStorage.setItem("originPage", "sign-up");
                }
            })
            .catch(function (error) {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occured try again later");
                }
            });
    };

    return (
        <div className="register min-h-screen grid items-center justify-center px-5 py-3">
            <div className="card flex flex-col md:flex-row bg-white rounded-lg overflow-hidden border-gray-300 border-solid border-2 w-full max-w-2xl h-full md:h-3/4">
                <div
                    className="left flex-1 bg-cover bg-center bg-gradient-to-b from-purple-700 to-purple-500 p-10 md:p-10 flex flex-col gap-7 text-white"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${signloginImage})`,
                        backgroundSize: "cover",
                        padding: "40px",
                    }}>
                    <h1 className="text-5xl md:text-5xl font-serif">Book.D</h1>
                    <p className="mt-5 text-sm md:text-base">
                        At Book.D, we believe in the magic of books. Explore our
                        curated selection and experience the joy of reading.
                        With options to both buy and rent, we make it easy for
                        you to enjoy the books you love.
                    </p>
                    <span className="text-xs md:text-sm">
                        Do you have an account?
                    </span>
                    <Link to="/login">
                        <button className="w-full md:w-1/2 px-4 py-2 text-gray-700 bg-white font-medium cursor-pointer mt-4 md:mt-14 rounded-lg">
                            Login
                        </button>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col gap-6 justify-center p-6 md:ml-10 md:px-7">
                    <h1 className="text-2xl md:text-3xl text-gray-700 font-serif mt-10 md:mt-20 text-center">
                        Sign up
                    </h1>
                    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
                        <SignInButton />
                    </GoogleOAuthProvider>

                    <div className="pb-10 md:pb-20 ">
                        <form className="flex flex-col gap-1">
                            <input
                                type="text"
                                placeholder="Name"
                                className="border-b border-gray-300 px-5 py-3"
                                style={{ marginBottom: "5px" }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="border-b border-gray-300 px-5 py-3"
                                style={{ marginBottom: "5px" }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="phone number"
                                className="border-b border-gray-300 px-5 py-3"
                                style={{ marginBottom: "5px" }}
                                autoComplete="off"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                }}
                            />
                            <div className="relative">
                                <input
                                    type={
                                        isPasswordVisible ? "text" : "password"
                                    }
                                    placeholder="Password"
                                    className="border-b border-gray-300 px-5 py-3 w-full"
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

                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="border-b border-gray-300 px-5 py-3 w-full"
                                    style={{ marginBottom: "5px" }}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex justify-center items-center">
                                <button
                                    type="submit"
                                    className="w-full md:w-32 h-10 bg-gradient-to-r from-orange-500 via-orange-800 to-orange-900 text-white font-bold cursor-pointer rounded-lg mt-4 flex items-center justify-center text-xs"
                                    onClick={handleRegister}>
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
