import backGroundImage from "../../assets/bookf1.webp";
import React from "react";

const Background: React.FC = () => {
    return (
        <div className="relative h-screen">
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backGroundImage})` ,filter: 'brightness(0.7)'}}
            >
               
            </div>
        </div>
    );
};

export default Background;
