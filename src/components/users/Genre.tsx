import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Box, Image, Text, Flex, Icon } from "@chakra-ui/react";
import {userAxiosInstance} from '../../utils/api/axiosInstance'
import { FaBookReader } from "react-icons/fa";

interface Genres {
  _id: string;
  genreName: string;
  image: string;
}

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 4,
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

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await userAxiosInstance.get("/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  if (genres.length === 0) {
    return null;
  }

  return (
    <Box className="side mt-10 items-center justify-center px-10">
      <Box className="h-12 w-full flex flex-col items-center justify-center mb-6">
        <Text
          fontSize="xx-large"
          fontFamily="serif"
          fontWeight="thickness"
          pl="12"
        >
          Genres
        </Text>
        <Flex align="center" width="100%" mt="2">
          <Box h="1px" bg="grey" flex="1" />
          <Icon
            as={FaBookReader}
            mx="2"
            bg="gray.200"
            p="2"
            borderRadius="50%"
            boxSize="1.5em"
          />
          <Box h="1px" bg="grey" flex="1" />
        </Flex>
      </Box>
      <Box className="container mt-12">
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
          {genres.map((genre) => (
            <Box key={genre._id} display="flex" justifyContent="center" mx="2">
              <Image
                src={genre.image}
                alt={`Genre ${genre._id}`}
                boxSize="30vh"
                objectFit="cover"
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default Genre;
