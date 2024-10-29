import React, { useEffect, useState,useRef } from "react";
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
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const genresContainerRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            try {
                const response = await adminAxiosInstance.get("/genres");
                console.log(response,'resposen')
                setGenres(response.data);
                setHasMore(response.data.length > 0);
            } catch (error) {
                toast.error("Error fetching genres");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const handleScroll = () => {
        const container = genresContainerRef.current;
        if (container) {
            if (
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 5 && !loading && hasMore
            ) {
                setOffset((prev) => prev + 10); 
            }
        }
    };

    useEffect(() => {
        const container = genresContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => {
                container.removeEventListener("scroll", handleScroll);
            };
        }
    }, [loading, hasMore]);

    const handleEditGenre    = (genreId: string) => {
        navigate(`/admin/edit-genre/${genreId}`);
    };


    const handleDeleteGenre = async (genreId: string) => {
        try {
            await adminAxiosInstance.post('/delete-genre', { genreId });
            setGenres((prevGenres) => prevGenres.filter((genre) => genre._id !== genreId));
            toast.success("Genre deleted successfully");
        } catch (error) {
            console.error('Error deleting genre:', error);
            toast.error("Failed to delete genre");
        }
    };
    
    if (loading) {
        return (
            <Box className="flex justify-center items-center h-full">
                <Spinner size="xl" color="teal.500" />
            </Box>
        );
    }

    return (
        <Box className="w-full bg-stone-900 rounded-lg">
            <Text className="text-2xl font-custom text-zinc-300 mb-4">
                List of Genres
            </Text>
            <Box   ref={genresContainerRef}
                className="max-h-80 overflow-y-auto" 
            >
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
                        <Box className="flex items-center space-x-8">
                            <IconButton
                                aria-label="Edit Genre"
                                icon={<FaEdit />}
                                colorScheme="white"
                                color="white"
                                onClick={() => handleEditGenre(genre._id)}
                                size="sm"
                            />
                            <IconButton
                                aria-label="delete Genre"
                                icon={<FaTrashAlt />}
                                colorScheme="white"
                                color="white"
                                onClick={() => handleDeleteGenre(genre._id)}
                                size="sm"
                            />
                        </Box>
                     
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default GenresList;
