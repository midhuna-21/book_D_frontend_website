import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import { FaPlus } from "react-icons/fa";
import AddGenre from './Genn'
import GenresList from "../../components/admin/GenresList";

const AddGenresWithList: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [genreName, setGenreName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        if(!genreName.trim()){
            toast.error("Please enter genre name.");
            return;
        }
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
        <div className="flex md:flex-row flex-col items-start min-h-screen bg-stone-900 p-8 rounded-2xl ">
             <div className="p-8 rounded shadow-md w-full sm:w-1/2">
                <GenresList />
            </div>
         <div className="p-8 rounded shadow-md w-full sm:w-1/2 ">
             <AddGenre />
            </div>
           
        </div>
    );
};

export default AddGenresWithList;
