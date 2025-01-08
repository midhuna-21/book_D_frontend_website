import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Box, Image, Text, Flex, Icon } from "@chakra-ui/react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { FaBookReader } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Genres {
    _id: string;
    genreName: string;
    image: string;
}

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 768, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const Genre: React.FC = () => {
    const [genres, setGenres] = useState<Genres[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await userAxiosInstance.get("/books/genres");
                setGenres(response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "An error occurred while fetching genres, please try again later"
                    );
                    console.error("Error fetching genres:", error);
                }
            }
        };

        fetchGenres();
    }, []);

    const handleGenreClick = (genreName: string) => {
        navigate("/explore-books", { state: { genreName } });
    };

    if (genres.length === 0) {
        return null;
    }

    return (
        <Box className="side mt-10 items-center justify-center px-10">
            <Box className="container mt-12">
                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={3000}>
                    {genres.map((genre) => (
                      <Box
                      key={genre._id}
                      textAlign="center"
                      onClick={() => handleGenreClick(genre.genreName)}
                  >
                      <Flex
                          justifyContent="center"
                          alignItems="center"
                          flexDirection="column"
                          mx="2">
                          <Image
                              src={genre.image}
                              alt={`Genre ${genre._id}`}
                              boxSize="150px"
                              objectFit="cover"
                              boxShadow="md"
                              cursor="pointer"
                              _hover={{
                                  transform: "scale(1.1)",
                                  transition: "all 0.3s ease-in-out",
                                  boxShadow: "lg",
                              }}
                          />
                          <Text
                              mt="2"
                              fontSize="lg"
                              fontWeight="semibold"
                              color="gray.700">
                              {genre.genreName}
                          </Text>
                      </Flex>
                  </Box>
                    ))}
                </Carousel>
            </Box>
        </Box>
    );
};

export default Genre;