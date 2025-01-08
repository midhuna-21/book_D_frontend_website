import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link,useLocation } from "react-router-dom";
import { useSocket } from "../../utils/context/SocketProvider";
import { clearUser } from "../../utils/ReduxStore/slice/userSlice";
import userLogo from "../../assets/userLogo.png";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { toast } from "sonner";

const Header: React.FC = () => {
    const userInfo = useSelector(
        (state: RootState) => state.user.userInfo?.user
    );
    const location = useLocation();
    const userId = userInfo?._id || "";
    const name = userInfo?.name || "";
    const picture = userInfo?.image || userLogo;
    const [isHovered, setIsHovered] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messageCount, setMessageCount] = useState<number>(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const { socket } = useSocket();

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isHomePage = location.pathname === "/home";
    const isProfilePage = location.pathname === "/profile"; 
    const navLinkStyle = isHomePage
        ? "text-white hover:text-gray-300"
        : "text-black hover:text-gray-600";

    const activeNavLinkStyle = isHomePage
        ? "border-b-2 border-white text-white"
        : "border-b-2 border-black text-black";

    useEffect(() => {
        if (userId) {
            const fetchNotificationCount = async () => {
                try {
                    const response = await userAxiosInstance.get(
                        `/notifications/unread/${userId}`
                    );
                    setNotificationCount(response?.data?.count);
                } catch (error: any) {
                    if (error.response && error.response.status === 403) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error(
                            "An error occurred, please try again later"
                        );
                        console.error(
                            "Failed to fetch notifications count",
                            error
                        );
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
                } catch (error: any) {
                    if (error.response && error.response.status === 403) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error(
                            "An error occurred while fetching messages, please try again later"
                        );
                        console.error("Failed to fetch message count", error);
                    }
                }
            };
            fetchMessageCount();
        }
    }, []);

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

    return (
        <>
   <header
            className={`flex items-center justify-between fixed top-0 w-full z-50 transition-all duration-300 ${
                isHomePage ? "bg-transparent" : "bg-transparent"
            }`}
            style={{
                height: "80px",
                backgroundColor: isHomePage ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)", 
                backdropFilter: "blur(5px)", 
            }}
        >
           
            <Link to="/home" className="flex flex-col items-center ml-10">
                <div
                    className={`text-3xl font-serif font-bold tracking-wider ${
                        isHomePage ? "text-purple-700" : "text-purple-600"
                    }`}
                >
                    Book<span className={isHomePage ? "text-white" : "text-gray-800"}>.D</span>
                </div>
                <span
                    className={`text-sm font-light ${
                        isHomePage ? "text-gray-300" : "text-gray-800"
                    }`}
                >
                    Your Book Sharing Hub
                </span>
            </Link>

            <div className="flex items-center space-x-8 ml-10">
                <Link
                    to="/home"
                    className={`flex flex-col items-center cursor-pointer ${
                        location.pathname === "/home" ? activeNavLinkStyle : navLinkStyle
                    }`}
                >
                    <span className="text-sm">Home</span>
                </Link>

                <Link
                    to="/explore-books"
                    className={`flex flex-col items-center cursor-pointer ${
                        location.pathname === "/explore-books" ? activeNavLinkStyle : navLinkStyle
                    }`}
                >
                    <span className="text-sm">Books</span>
                </Link>

                <Link
                    to="/lend-book"
                    className={`flex flex-col items-center cursor-pointer ${
                        location.pathname === "/lend-book" ? activeNavLinkStyle : navLinkStyle
                    }`}
                >
                    <span className="text-sm">Lend</span>
                </Link>

                <Link
                    to="/chat"
                    className={`flex flex-col items-center cursor-pointer ${
                        location.pathname === "/chat" ? activeNavLinkStyle : navLinkStyle
                    }`}
                >
                    <span className="text-sm">Messages</span>
                </Link>

                <Link
                    to="/notifications"
                    className={`flex flex-col items-center cursor-pointer ${
                        location.pathname === "/notifications" ? activeNavLinkStyle : navLinkStyle
                    }`}
                >
                    <span className="text-sm">Notifications</span>
                </Link>

                <Link
                    to="/profile"
                    className={`flex flex-col items-center cursor-pointer ${
                        location.pathname === "/profile" ? activeNavLinkStyle : navLinkStyle
                    }`}
                >
                    <span className="text-sm">Profile</span>
                </Link>
            </div>
            <div className="flex items-center mr-10">
                <div
                onClick={handleLogout}
                    className={`text-sm cursor-pointer ${
                        isHomePage ? "text-gray-300" : "text-gray-800"
                    } hover:text-blue-500`}
                >
                    Sign Out
                </div>
            </div>
        </header>
</>

    );
};

export default Header;
