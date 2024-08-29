import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
    FaHome,
    FaUser,
    FaEnvelope,
    FaBell,
    FaCompass,
    FaBook,
    FaSignOutAlt,
    FaTimes,
    FaSearch,
} from "react-icons/fa";
import { clearUser } from "../../utils/ReduxStore/slice/userSlice";
import logo from "../../assets/logo.png";
import userLogo from "../../assets/userLogo.png";
import { RootState } from "../../utils/ReduxStore/store/store";

const Header: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo?.user);
    const name = userInfo?.name || "";
    const picture = userInfo?.image || userLogo;
    const [isHovered, setIsHovered] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

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

    return (
        <>
            <header
                className={`flex items-center justify-between fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-2xl ${
                    !visible && "transform -translate-y-full"
                }`}
                style={{ height: "80px" }}>
                <div className="flex items-center ml-4">
                    <img src={logo} alt="Logo" className="h-12" />
                    <span className="font-serif ml-2 text-emerald-800 text-xl">
                        Book.D
                    </span>
                </div>
                <div className="flex items-center space-x-4 px-10 mr-12 gap-10">
                    <div className="relative flex items-center">
                        {isSearchVisible && (
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="search..."
                                    className="bg-white text-gray-900 placeholder-gray-500 w-96 px-4 py-2 focus:outline-none focus:ring focus:border-blue-900 shadow-lg rounded-3xl"
                                />
                                <FaTimes
                                    className="absolute right-3 text-gray-800 cursor-pointer"
                                    onClick={hideSearch}
                                />
                            </div>
                        )}
                        <div
                            className="relative flex items-center justify-center cursor-pointer px-2"
                            onClick={toggleSearch}>
                            <div className="relative flex flex-col items-center cursor-pointer">
                                <div className="hover:bg-gray-200 hover:w-12 hover:h-12 hover:rounded-full flex items-center justify-center">
                                    <FaSearch />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link to="/home">
                        <div className="relative flex flex-col items-center cursor-pointer">
                            <div className="hover:bg-gray-200 hover:w-12 hover:h-12 hover:rounded-full flex items-center justify-center">
                                <FaHome className="text-gray-800 text-xl" />
                            </div>
                            <span className="text-xs">Home</span>
                        </div>
                    </Link>
                    <Link to="/home/explore">
                    <div className="relative flex flex-col items-center cursor-pointer ">
                        <div className="hover:bg-gray-200 hover:w-12 hover:h-12 hover:rounded-full flex items-center justify-center">
                            <FaCompass className="text-gray-800 text-xl" />
                        </div>
                        <span className="text-xs">Explore</span>
                    </div>
                    </Link>
                    <Link to="/home/add-book">
                        <div className="relative flex flex-col items-center cursor-pointer ">
                            <div className="hover:bg-gray-200 hover:w-12 hover:h-12 hover:rounded-full flex items-center justify-center">
                                <FaBook className="text-gray-800 text-xl" />
                            </div>
                            <span className="text-xs">Add Book</span>
                        </div>
                    </Link>
                    <Link to='/home/chat'>  
                    <div className="relative flex flex-col items-center cursor-pointer ">
                        <div className="hover:bg-gray-200 hover:w-12 hover:h-12 hover:rounded-full flex items-center justify-center">
                            <FaEnvelope className="text-gray-800 text-xl" />
                        </div>
                        <span className="text-xs">Messages</span>
                    </div>
                    </Link>

                    <Link to='/home/notifications'>
                    <div className="relative flex flex-col items-center cursor-pointer">
                        <div className="hover:bg-gray-200 hover:w-12 hover:h-12 hover:rounded-full flex items-center justify-center">
                            <FaBell className="text-gray-800 text-xl" />
                        </div>
                        <span className="text-xs">Notifications</span>
                    </div>
                    </Link>
                    {/* <Link to="/home/profile">
                    <div className="relative flex items-center justify-center cursor-pointer" onMouseEnter={() => setIsHovered('profile')} onMouseLeave={() => setIsHovered('')}>
                        <FaUser className="text-gray-800" />
                        {isHovered === 'profile' && (
                            <div className="absolute flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                                <FaUser />
                            </div>
                        )}
                    </div>
                </Link>
                 */}
                    {/* <div className="relative flex items-center justify-center cursor-pointer" onClick={handleLogout} onMouseEnter={() => setIsHovered('logout')} onMouseLeave={() => setIsHovered('')}>
                    <FaSignOutAlt className="text-gray-800" />
                    {isHovered === 'logout' && (
                        <div className="absolute flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                            <FaSignOutAlt />
                        </div>
                    )}
                </div> */}
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
                                        <Link to="/home/profile">
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
            {/* <div className="absolute top-4 w-full sm:w-3/4 lg:w-full bg-green-900 bg-opacity-75 rounded-lg p-4 text-center shadow-lg py-12">
                    <p className="text-lg font-serif text-gray-700">
                        @Book.D share your book securely through this app with the world.
                    </p>
                </div> */}
        </>
    );
};

export default Header;
