import React, { useEffect, useState } from "react";
import {
    Box,
    Image,
    Text,
    Button,
    Spinner,
    IconButton,
} from "@chakra-ui/react";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Genres {
    _id: string;
    genreName: string;
    image: string;
}

const GenresList: React.FC = () => {
    const [genres, setGenres] = useState<Genres[]>([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            try {
                const response = await adminAxiosInstance.get("/genres");
                setGenres(response.data);
            } catch (error) {
                toast.error("Error fetching genres");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const handleDeleteGenre = async (genreId: string) => {
        if (!window.confirm("Are you sure you want to delete this genre?"))
            return;

        try {
            const response = await adminAxiosInstance.delete(
                `/genres/${genreId}`,
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                toast.success("Genre deleted successfully");
                setGenres(genres.filter((genre) => genre._id !== genreId));
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting genre");
        }
    };

    const handleEditGenre = (genreId: string) => {
        navigate(`/admin/edit-genre/${genreId}`);
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-full">
                <Spinner size="xl" color="teal.500" />
            </Box>
        );
    }

    return (
        <Box className="w-full p-6 bg-stone-900 rounded-lg mt-4">
            <Text className="text-2xl font-custom text-zinc-300 mb-4">
                List of Genres
            </Text>
            <Box className="space-y-6">
                {genres.map((genre) => (
                    <Box
                        key={genre._id}
                        className="flex items-center justify-between p-4 border-b border-zinc-700">
                        <Box className="flex items-center">
                            <Image
                                src={genre.image}
                                alt={genre.genreName}
                                boxSize="50px"
                                objectFit="cover"
                                className="rounded-full mr-4"
                            />
                            <Text className="text-lg font-semibold text-zinc-300">
                                {genre.genreName}
                            </Text>
                        </Box>
                        <Box className="flex space-x-9">
                            <IconButton
                                aria-label="Edit Genre"
                                icon={<FaEdit />}
                                colorScheme="white"
                                color="white"
                                onClick={() => handleEditGenre(genre._id)}
                                size="sm"
                            />
                            <Button
                                colorScheme="red"
                                color="white"
                                onClick={() => handleDeleteGenre(genre._id)}
                                leftIcon={<FaTrashAlt />}
                                size="sm"></Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default GenresList;
