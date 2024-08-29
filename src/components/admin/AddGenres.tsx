import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {useDispatch,useSelector} from 'react-redux'
import {RootState} from '../../utils/ReduxStore/store/store'
import { addGenre } from "../../utils/ReduxStore/slice/adminSlice";
import { adminAxiosInstance } from "../../utils/api/axiosInstance";
import { FaPlus } from "react-icons/fa";

const AddGenresWithList: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [genreName, setGenreName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const genres = useSelector((state: RootState) => state.admin?.genres);

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

    const handleAddGenre = (e: React.FormEvent) => {
        e.preventDefault();

        if (!genreName || !file) {
            toast.error("Please fill in all fields and select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("genreName", genreName);
        formData.append("file", file);

        adminAxiosInstance
            .post("/add-genre", formData, {   
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.status === 200) {
                    toast.success("Successfully added");
                    dispatch(addGenre(response.data))
                    setGenreName("");
                    setSelectedImage(null);
                    setFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, try again later");
                }
            });
    };

    return (
        <div className="flex items-start h-screen bg-stone-900 p-8 rounded-2xl">
            <div className="p-8 rounded shadow-md w-1/2 mr-4">
                <h2 className="text-2xl font-custom mb-6 text-zinc-300">
                    Add New Genre
                </h2>
                <form onSubmit={handleAddGenre}>
                    <div className="mb-4">
                        <label
                            htmlFor="genreName"
                            className="block text-zinc-300 mb-2 font-custom">
                            Genre Name
                        </label>
                        <input
                            type="text"
                            id="genreName"
                            className="w-full px-3 py-2 border rounded bg-zinc-300"
                            placeholder="Enter genre name"
                            value={genreName}
                            onChange={(e) => setGenreName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="image"
                            className="block text-zinc-300 mb-2 font-custom">
                            Upload Image
                        </label>
                        <div className="flex items-center">
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file"
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    required
                                />
                                <div className="bg-blue-900 text-white px-3 py-2 rounded-md w-32 text-center cursor-pointer">
                                    Choose File
                                </div>
                            </div>
                            {selectedImage && (
                                <div className="ml-4">
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className="h-16 w-16 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-green-950 hover:bg-green-800 text-zinc-300 font-bold py-2 px-4 rounded flex items-center justify-center space-x-2">
                            <span>Add</span> <FaPlus />
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-600 text-zinc-300 font-bold py-2 px-4 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGenresWithList;
