import React from "react";
import Genre from "../../components/users/Genre";
import Books from "../../components/users/Books";
import backgroundVideo from "../../assets/homeBannervideo1.mp4";

const CenterOfHome: React.FC = () => {
    return (
        <div className="flex flex-col">
            <div className="relative bg-gradient-to-b from-black via-gray-900 to-blue-900 bg-cover bg-center min-h-[90vh] w-full flex items-center justify-center">
                <video
                    className="absolute inset-0 w-full h-full object-cover "
                    autoPlay
                    loop
                    muted
                    playsInline>
                    <source src={backgroundVideo} type="video/mp4" />
                </video>

                <div
                    className="absolute inset-0 bg-black opacity-30"
                    aria-hidden="true"
                />

                <div
                    className="absolute inset-0 bg-black opacity-20"
                    aria-hidden="true"
                />
                <div className="relative flex flex-col justify-center items-center px-4 sm:px-8 text-center text-white z-10">
                    <span className="text-4xl md:text-5xl font-serif">
                        Start Your Book
                    </span>
                    <span className="text-3xl md:text-4xl font-serif text-gray-200">
                        Sharing Journey
                    </span>
                </div>
            </div>
            <div className="w-full ">
                <Genre />
                <Books />
            </div>
        </div>
    );
};

export default CenterOfHome;
