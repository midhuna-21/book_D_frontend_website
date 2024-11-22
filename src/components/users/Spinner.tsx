import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

const Spinner: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-white">
            {loading ? (
                <>
                    <ClipLoader size={50} color={"#3498db"} loading={loading} />
                    <h1 className="text-2xl">please wait!</h1>
                </>
            ) : (
                <div className="text-center">
                    <h1 className="text-2xl">please wait!</h1>
                </div>
            )}
        </div>
    );
};

export default Spinner;
