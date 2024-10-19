import React, { useState } from "react";
import AddBookForm from "../users/AddBookForm";

const Options: React.FC = () => {
    const [activeOption, setActiveOption] = useState("addBooks");

    const handleOptionClick = (option: string) => {
        setActiveOption(option);
    };

    const renderComponent = () => {
        switch (activeOption) {
            case "addBooks":
                return <AddBookForm />;
            case "rentedBooks":
            case "soldBooks":
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100  mx-auto shadow-md mt-16 w-full max-w-full sm:px-8 lg:px-16">
            <div className="flex flex-wrap justify-center gap-5 py-10">
                <button
                    className={`border-2 border-slate-600 px-4 py-2 rounded-md text-black font-serif hover:bg-gray-800 hover:border-gray-900 hover:text-white ${
                        activeOption === "addBooks"
                            ? "bg-gray-800 text-white"
                            : ""
                    }`}
                    onClick={() => handleOptionClick("addBooks")}>
                    Add Books
                </button>
                <button
                    className={`border-2 border-slate-600 px-4 py-2 rounded-md text-black font-serif hover:bg-gray-800 hover:border-gray-900 hover:text-white ${
                        activeOption === "rentedBooks"
                            ? "bg-gray-800 text-white"
                            : ""
                    }`}
                    onClick={() => handleOptionClick("rentedBooks")}>
                    Rented Books
                </button>
                <button
                    className={`border-2 border-slate-600 px-4 py-2 rounded-md text-black font-serif hover:bg-gray-800 hover:border-gray-900 hover:text-white ${
                        activeOption === "soldBooks"
                            ? "bg-gray-800 text-white"
                            : ""
                    }`}
                    onClick={() => handleOptionClick("soldBooks")}>
                    Sold Books
                </button>
            </div>
            {renderComponent()}
        </div>
    );
};

export default Options;
