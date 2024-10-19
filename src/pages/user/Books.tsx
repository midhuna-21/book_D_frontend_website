import React from "react";
import Background from "../../components/users/Background";
import SideBar from "../../components/users/SideBar";
import Options from "../../components/users/Options";
import RentFormBook from "../../components/users/AddBookForm";

const BookManage: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 relative">
                <Background />
                <div className="absolute inset-0 flex">
                    <SideBar />
                    <div className="flex flex-1 relative flex-col">
                        <div className="absolute inset-0 flex items-center ">
                            <Options />
                        </div>
                        <div className="px-12">
                            <RentFormBook />
                        </div>
                    </div>
                </div>
            </div>
            {/* <AddBook /> */}
        </div>
    );
};

export default BookManage;
