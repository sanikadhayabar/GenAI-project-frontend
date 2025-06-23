import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Heading,
} from '@chakra-ui/react';
import { fetchImages } from './api';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        const data = await fetchImages();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Image Gallery</Heading>
      {images.length === 0 ? (
        <Text>No images found.</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {images.map((img) => (
            <Box key={img.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Image src={`data:image/png;base64,${img.image_data}`} alt={img.prompt} />
              <Box p="4">
                <Text fontWeight="bold">{img.prompt}</Text>
                <Text fontSize="sm" color="gray.500">
                  Seed: {img.seed}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default Gallery;
