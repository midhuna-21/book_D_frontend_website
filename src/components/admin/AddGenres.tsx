import React from "react";
import AddGenre from "./Genn";
import GenresList from "../../components/admin/GenresList";

const AddGenresWithList: React.FC = () => {
    return (
        <div className="flex md:flex-row flex-col items-start min-h-screen bg-white p- rounded">
            <div className="w-full md:w-1/2 p-8 ">
                <h1 className="font-serif text-2xl mb-4">Genres</h1>
                <div className="mt-4">
                    <GenresList />
                </div>
            </div>

            <div className="p-8 w-full sm:w-1/2 h-auto">
                <h1 className="font-serif text-2xl mb-4">Add Genre</h1>
                <AddGenre />
            </div>
        </div>
    );
};

export default AddGenresWithList;
