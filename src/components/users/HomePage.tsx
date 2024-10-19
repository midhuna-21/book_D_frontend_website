import backGroundImage from "../../assets/bookf1.webp";
import React from "react";
import Genre from "../../components/users/Genre";
import HowItWorks from "../../components/users/HowItWorks";
import Books from "../../components/users/Books";

const CenterOfHome: React.FC = () => {
    return (
        <div className="flex flex-col">
            <div
                className="relative bg-cover bg-center min-h-[70vh] w-full flex items-center justify-center"
                style={{ backgroundImage: `url(${backGroundImage})` }}>
                <div
                    className="absolute inset-0 bg-black opacity-20"
                    aria-hidden="true"
                />
                <div className="relative flex flex-col justify-center items-center px-4 sm:px-8 text-center text-white z-10">
                    <span className="py-4 text-2xl md:text-3xl font-serif">
                        Book.D
                    </span>
                    <span className="text-4xl md:text-5xl font-serif">
                        Start Your Book
                    </span>
                    <span className="text-3xl md:text-4xl font-serif text-gray-200">
                        Sharing Journey
                    </span>
                </div>
            </div>
            <div className="w-full">
                <Genre />
                <Books />
                <HowItWorks />
            </div>
        </div>
    );
};

export default CenterOfHome;
