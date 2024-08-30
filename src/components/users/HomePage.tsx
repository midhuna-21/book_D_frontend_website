import backGroundImage from "../../assets/bookf1.webp";
import React from "react";
import Genre from "../../components/users/Genre";
import Books from "../../components/users/Books";
import HowItWorks from '../../components/users/HowItWorks'

const CenterOfHome: React.FC = () => {
    return (
        <div className="flex flex-col">
            <div
                className="w-full bg-cover bg-center h-screen flex items-center justify-center"
                style={{ backgroundImage: `url(${backGroundImage})` }}>
                <div className="flex flex-col justify-center items-center px-4 sm:px-8">
                    <span className="py-10 text-2xl  md:text-2xl font-serif">Book.D</span>
                    <span className="text-6xl md:text-6xl font-serif">
                        Start Your Book{" "}
                    </span>
                    <span className="text-4xl md:text-4xl font-serif text-gray-800 ">
                        Sharing Journey
                    </span>
                </div>
            </div>
            <div className="w-full py-8 md:py-12 px-4 sm:px-8">
                <Genre />
                {/* <HowItWorks />  */}
                {/* <Books /> */}
            </div>
        </div>
    );
};

export default CenterOfHome;
