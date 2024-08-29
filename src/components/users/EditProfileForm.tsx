import React, { useState, useEffect } from "react";

type EditProfileFormProps = {
    formData: {
        name: string;
        email: string;
        phone: string;
        city: string;
        district: string;
        state: string;
        image?: File | null; 
    };
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleCancelClick: () => void;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleCancelClick,
    handleImageChange,
}) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        if (formData.image instanceof File) {
            objectUrl = URL.createObjectURL(formData.image);
            setSelectedImage(objectUrl);
        } else {
            setSelectedImage(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [formData.image]);

    const handleRemoveImage = () => {
        setSelectedImage(null);
        const event = {
            target: {
                name: "image",
                value: "",
            },
        } as React.ChangeEvent<HTMLInputElement>;

        handleInputChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    };

    const handleImageChangeWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleImageChange(event);
        if (event.target.files && event.target.files[0]) {
            const imageFile = event.target.files[0];
            const objectUrl = URL.createObjectURL(imageFile);
            setSelectedImage(objectUrl);
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
        event.target.value = "";
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-full p-4 bg-white rounded-lg shadow-md mx-auto"
        >
            <div className="mb-4">
                <div className="flex flex-col items-center mt-1">
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChangeWrapper}
                        className="hidden"
                    />
                    {selectedImage && (
                        <div className="relative mb-4">
                            <img
                                src={selectedImage}
                                alt="Selected"
                                className="rounded-lg shadow-md max-h-80"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-gray-800 text-white rounded-full p-1 m-1 hover:bg-gray-600 transition duration-300"
                                onClick={handleRemoveImage}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
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
                    <label
                        htmlFor="image"
                        className="cursor-pointer bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition duration-300"
                    >
                        Upload Photo
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                    >
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="district"
                        className="block text-sm font-medium text-gray-700"
                    >
                        District
                    </label>
                    <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                    >
                        State
                    </label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-700 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-900 transition duration-300"
                >
                    Save
                </button>
                <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                    onClick={handleCancelClick}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditProfileForm;
