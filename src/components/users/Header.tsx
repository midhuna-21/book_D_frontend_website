import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSocket } from "../../utils/context/SocketProvider";
import {
    FaHome,
    FaUser,
    FaEnvelope,
    FaBell,
    FaCompass,
    FaBook,
    FaBars,
    FaSignOutAlt,
    FaTimes,
    FaSearch,
} from "react-icons/fa";
import { clearUser } from "../../utils/ReduxStore/slice/userSlice";
import logo from "../../assets/logo.png";
import userLogo from "../../assets/userLogo.png";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import {toast} from 'sonner';

const Header: React.FC = () => {
    const userInfo = useSelector(
        (state: RootState) => state.user.userInfo?.user
    );
    const userId = userInfo?._id || "";
    const name = userInfo?.name || "";
    const picture = userInfo?.image || userLogo;
    const [isHovered, setIsHovered] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messageCount, setMessageCount] = useState<number>(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const location = useLocation();
    const { socket } = useSocket();
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScrollPos]);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 200);
        setPrevScrollPos(currentScrollPos);
    };

    const handleLogout = async () => {
        localStorage.removeItem("useraccessToken");
        localStorage.removeItem("userrefreshToken");
        dispatch(clearUser());
        navigate("/login");
    };

    const toggleSearch = () => {
        if (!isSearchVisible) {
            setIsSearchVisible(true);
        }
    };

    const hideSearch = () => {
        setIsSearchVisible(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = async (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            try {
                navigate("/explore-books", { state: { searchQuery } });
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        }
    };

    useEffect(() => {
        if (userId) {
            const fetchNotificationCount = async () => {
                try {
                    const response = await userAxiosInstance.get(
                        `/notifications/unread/${userId}`
                    );
                    setNotificationCount(response?.data?.count);
                } catch (error:any) {
                    if (error.response && error.response.status === 403) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("An error occurred, please try again later");
                        console.error("Failed to fetch notifications count", error);
                    }
                }
            };
            fetchNotificationCount();

            const fetchMessageCount = async () => {
                try {
                    const response = await userAxiosInstance.get(
                        `/messages/unread/${userId}`
                    );
                    setMessageCount(response?.data?.count);
                } catch (error:any) {
                    if (error.response && error.response.status === 403) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("An error occurred while fetching messages, please try again later");
                        console.error("Failed to fetch message count", error);
                    }
                }
            };
            fetchMessageCount();
        }
    },[]);

    useEffect(() => {
        if (socket) {
            socket.on("notification", () => {
                setNotificationCount((prevCount) => prevCount + 1);
            });

            socket.on("receive-message", () => {
                setMessageCount((prevCount) => prevCount + 1);
            });
        }

        return () => {
            if (socket) {
                socket.off("notification");
                socket.off("receive-message");
            }
        };
    }, [socket]);

    useEffect(() => {
        setIsSearchVisible(false);
        setSearchQuery("");
    }, [location]);

    return (
        <>
            <header
                className={`flex items-center justify-between fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-md ${
                    !visible && "transform -translate-y-full"
                }`}
                style={{ height: "80px" }}>
                <div className="flex items-center ml-4">
                    <img src={logo} alt="Logo" className="h-12" />
                    <span className="font-serif ml-2 text-emerald-800 text-xl">
                        Book.D
                    </span>
                </div>

                <div className="flex items-center md:hidden mr-4">
                    <button onClick={toggleMenu} className="focus:outline-none">
                        <FaBars className="text-gray-800 text-2xl" />
                    </button>
                </div>
                <div
                    className={`hidden md:flex items-center space-x-4 px-10 mr-12 gap-10`}>
                    <div className="relative flex items-center">
                        {isSearchVisible && (
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="search..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={handleSearch}
                                    className="bg-white text-gray-900 placeholder-gray-500 w-96 px-4 py-2 focus:outline-none focus:ring focus:border-blue-900 shadow-lg rounded-3xl"
                                />
                                <FaTimes
                                    className="absolute right-3 text-gray-800 cursor-pointer"
                                    onClick={hideSearch}
                                />
                            </div>
                        )}
                        <div
                            className="relative flex items-center justify-center cursor-pointer px-2 group"
                            onClick={toggleSearch}>
                            <div className="relative flex flex-col items-center cursor-pointer ">
                                <div className="flex items-center justify-center">
                                    <FaSearch />
                                </div>
                            </div>
                            <div className="absolute top-7 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity">
                                Search
                            </div>
                        </div>
                    </div>
                    <Link to="/home">
                        <div className="relative flex flex-col items-center cursor-pointer group">
                            <div className="flex items-center justify-center">
                                <FaHome className="text-gray-800 text-2xl" />
                            </div>
                            <div className="absolute top-8 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity">
                                Home
                            </div>
                        </div>
                    </Link>
                    <Link to="/explore-books">
                        <div className="relative flex flex-col items-center cursor-pointer group">
                            <div className="flex items-center justify-center">
                                <FaCompass className="text-gray-800 text-xl" />
                            </div>
                            <div className="absolute top-8 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity">
                                Explore
                            </div>
                        </div>
                    </Link>
                    <Link to="/lend-book">
                        <div className="relative flex flex-col items-center cursor-pointer group">
                            <div className="flex items-center justify-center">
                                <FaBook className="text-gray-800 text-xl" />
                            </div>
                            <div className="absolute top-8 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity">
                                RentBook
                            </div>
                        </div>
                    </Link>
                    <Link to="/chat">
                        <div className="relative flex flex-col items-center cursor-pointer group">
                            <div className="flex items-center justify-center">
                                <FaEnvelope className="text-gray-800 text-xl" />
                                {messageCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                                        {messageCount}
                                    </span>
                                )}
                            </div>
                            <div className="absolute top-8 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity">
                                Messages
                            </div>
                        </div>
                    </Link>

                    <Link to="/notifications">
                        <div className="relative flex flex-col items-center cursor-pointer group">
                            <div className="flex items-center justify-center">
                                <FaBell className="text-gray-800 text-xl" />
                                {notificationCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                                        {notificationCount}
                                    </span>
                                )}
                            </div>
                            <div className="absolute top-8 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity">
                                Notifications
                            </div>
                        </div>
                    </Link>

                    {name ? (
                        <div
                            className="relative flex items-center cursor-pointer"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}>
                            <img
                                src={picture}
                                // alt={user.name}
                                className="w-12 h-12 object-cover rounded-full border-2 shadow-md"
                            />
                            {isHovered && (
                                <div
                                    className="absolute top-9 left-[-20px] mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition duration-300 ease-in-out transform origin-top-left scale-100"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}>
                                    <ul className="py-1">
                                        <Link to={`/${name}`}>
                                            <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer transition duration-200 ease-in-out transform hover:translate-x-1 flex items-center space-x-2">
                                                <FaUser className="text-gray-500" />
                                                <span className="text-gray-800">
                                                    Profile
                                                </span>
                                            </li>
                                        </Link>
                                        <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer transition duration-200 ease-in-out transform hover:translate-x-1 flex items-center space-x-2">
                                            <FaSignOutAlt className="text-gray-500" />
                                            <span
                                                className="text-gray-800"
                                                onClick={handleLogout}>
                                                Logout
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/">
                            <button className="px-4 py-2 bg-fuchsia-950 text-white rounded-lg hover:bg-fuchsia-350">
                                Sign Up
                            </button>
                            <span
                                className="text-gray-800"
                                onClick={handleLogout}>
                                Logout
                            </span>
                        </Link>
                    )}
                </div>
            </header>
            {isMenuOpen && (
                <div className="md:hidden flex flex-col items-center bg-white shadow-lg fixed top-0 left-0 w-full mt-20 p-4 z-40">
                    <Link
                        to="/home"
                        className="py-2"
                        onClick={() => setIsMenuOpen(false)}>
                        <span className="text-gray-800 font-semibold">
                            Home
                        </span>
                    </Link>
                    <Link
                        to="/explore-books"
                        className="py-2"
                        onClick={() => setIsMenuOpen(false)}>
                        <span className="text-gray-800 font-semibold">
                            Explore
                        </span>
                    </Link>
                    <Link
                        to="/lend-book"
                        className="py-2"
                        onClick={() => setIsMenuOpen(false)}>
                        <span className="text-gray-800 font-semibold">
                            Lend Book
                        </span>
                    </Link>
                    <Link
                        to="/chat"
                        className="py-2"
                        onClick={() => setIsMenuOpen(false)}>
                        <span className="text-gray-800 font-semibold">
                            Messages
                        </span>
                    </Link>
                    <Link
                        to="/notifications"
                        className="py-2"
                        onClick={() => setIsMenuOpen(false)}>
                        <span className="text-gray-800 font-semibold">
                            Notifications
                        </span>
                    </Link>
                    {name ? (
                        <>
                            <Link
                                to="/profile"
                                className="py-2"
                                onClick={() => setIsMenuOpen(false)}>
                                <span className="text-gray-800 font-semibold">
                                    Profile
                                </span>
                            </Link>
                            <div
                                className="py-2 cursor-pointer"
                                onClick={handleLogout}>
                                <span className="text-gray-800 font-semibold">
                                    Logout
                                </span>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/"
                            className="py-2"
                            onClick={() => setIsMenuOpen(false)}>
                            <span className="text-gray-800 font-semibold">
                                Sign Up
                            </span>
                        </Link>
                    )}
                </div>
            )}
        </>
    );
};

export default Header;
