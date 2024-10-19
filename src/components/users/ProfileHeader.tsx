import React, { useState } from "react";
import bookHeader from "../../assets/bookHeader.png";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { addUser } from "../../utils/ReduxStore/slice/userSlice";
import photo from "../../assets/th.jpeg";
import { FaCamera, FaTrashAlt } from "react-icons/fa";
import "../../styles/tailwind.css";
import { Box } from "@chakra-ui/react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";

const ProfileHeader: React.FC = () => {
    const user = useSelector((state: RootState) => state?.user?.userInfo?.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useDispatch();

    const openModal = () => {
        setIsModalOpen(true);
        setSelectedImage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("selectedImage", file);

        try {
            const response = await userAxiosInstance.put(
                "/update-profile-image",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                dispatch(addUser(response.data));
                setSelectedImage(null);
                closeModal();
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, try again later");
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            setFile(file);
        } else {
            setSelectedImage(null);
            setFile(null);
            toast.error("Please select a valid image file.");
        }
    };
    const handleRemove = async (e: React.FormEvent) => {
        e.preventDefault();
        const imageToRemove = user?.image;
        
        if (!imageToRemove) {
            toast.error("No image to remove.");
            return;
        }
        try {
            const response = await userAxiosInstance.delete(
                "/delete-profile-image",
                {
                    data: { imageToRemove },
                    withCredentials: true,
                }
            );
            if (response.status == 200) {
                dispatch(addUser(response.data));
                setSelectedImage(null);
                setFile(null);
            }
        } catch (error: any) {
            toast.error("An error occurred, try again later.");
        }
    };
    return (
        <div className="flex flex-col items-center md:items-start">
            <div
                className="p-6 h-60 flex flex-col items-center relative w-full"
                style={{
                    backgroundImage: `url(${bookHeader})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                <div className="absolute -bottom-16 left-1/2 transform md:ml-16 -translate-x-1/2 md:left-20 md:-bottom-16 w-32 md:w-52 h-32 md:h-52 bg-white rounded-full overflow-hidden">
                    <img
                        src={user?.image || photo}
                        alt="photo"
                        className="object-cover w-full h-full"
                    />
                    <button
                        className="absolute bottom-2 right-2 md:bottom-3 md:right-8 bg-gray-200 p-2 rounded-full z-10"
                        onClick={openModal}>
                        <FaCamera className="text-gray-700" />
                    </button>
                </div>
            </div>
            <div className="bg-gray-200 h-20 flex flex-col md:flex-row items-center p-4 md:pl-20 w-full">
                <div className="flex flex-row items-center w-full md:w-auto">
                    <div className="w-32 md:w-52 h-32 md:h-52"></div>
                    <div>
                        <h1 className="name font-serif text-2xl md:text-3xl">
                            {user?.name}
                        </h1>
                        {/* <p className="email text-sm font-normal">
                            {user?.email}
                        </p> */}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
                        <button
                            type="button"
                            className="absolute top-2 right-2  text-black rounded-full p-1 hover:text-white hover:bg-red-500 transition duration-300"
                            onClick={closeModal}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-lg font-serif text-center mb-4">
                            Update Profile Image
                        </h2>
                        <Box h="1px" bg="grey" flex="1" />

                        <div className="flex flex-col items-center space-y-4 mt-6">
                            {user?.image && !selectedImage && (
                                <div className="relative mb-4 flex justify-center items-center">
                                    <img
                                        src={user.image}
                                        alt="User Image"
                                        className="w-32 md:w-60 h-32 md:h-60 object-cover"
                                    />
                                </div>
                            )}
                            {selectedImage && (
                                <div className="relative mb-4 flex justify-center items-center">
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className="w-32 md:w-60 h-32 md:h-60 object-cover"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-600 transition duration-300"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setFile(null);
                                        }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {!selectedImage && user?.image && (
                                    <button
                                        type="button"
                                        className="text-black rounded-full p-1 cursor:pointer transition duration-300"
                                        onClick={handleRemove}>
                                        <FaTrashAlt className="h-6 w-6" />
                                    </button>
                                )}
                                <label className="block button-profile-photo-box">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />
                                    <button className="button-profile-photo py-2 px-2">
                                        Choose File
                                    </button>
                                </label>
                                <div>
                                    {file && (
                                        <button
                                            onClick={handleSubmit}
                                            className="bg-green-950 p-2 px-3 font-bold text-white">
                                            Upload
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProfileHeader;
