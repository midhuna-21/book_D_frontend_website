import React, { useState, useEffect, useRef } from "react";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditGenre: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [genreName, setGenreName] = useState<string>("");
    const { genreId } = useParams();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const response = await adminAxiosInstance.get(
                    `/genres/${genreId}`
                );
                const fetchedGenre = response?.data;

                if (fetchedGenre) {
                    setGenreName(fetchedGenre.genreName);
                    setSelectedImage(fetchedGenre.image);
                }
            } catch (error) {
                console.error("Error fetching genre details", error);
            }
        };
        fetchGenre();
    }, [genreId]);

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

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            const name = genreName.toLowerCase();
            formData.append("genreName", name);
            if (file) {
                formData.append("file", file);
            } else if (selectedImage) {
                formData.append("exisitingImage", selectedImage);
            }

            const response = await adminAxiosInstance.post(
                `/genres/update/${genreId}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                const fetchedGenre = response?.data;

                if (fetchedGenre) {
                    setGenreName(fetchedGenre.genreName);
                    setSelectedImage(fetchedGenre.image);
                    navigate("/admin/add-genre");
                }
            }
        } catch (error: any) {
            console.error("Error updating genre:", error);
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, try again later.");
            }
        }
    };

    return (
        <div className="flex items-start h-screen bg-white p-8 rounded-2xl">
            <div className="p-8 shadow-md w-1/2 mr-4">
                <h2 className="text-2xl font-custom mb-6">Edit Genre</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label
                            htmlFor="genreName"
                            className="block text-blue-400 mb-2 font-custom">
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
                            className="block text-blue-400 mb-2 font-custom">
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
                            className="bg-green-950 hover:bg-green-800 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2">
                            <span>Update</span>
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGenre;
