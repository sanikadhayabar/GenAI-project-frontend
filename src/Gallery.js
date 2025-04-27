import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Image,
  Text,
  VStack,
  Button,
  Link,
  Spinner,
  Center,
  Flex,
  Badge,
  Tooltip,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  StarIcon, 
  TimeIcon 
} from '@chakra-ui/icons';
import { getImages } from './api';

const GalleryItem = ({ image }) => {
  // Convert timestamp to readable date format
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Link
      as={RouterLink}
      to={`/image/${image.id}`}
      _hover={{ textDecoration: 'none' }}
      height="100%"
    >
      <Card
        overflow="hidden"
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
        borderRadius="xl"
        transition="all 0.3s"
        _hover={{ 
          transform: 'translateY(-8px)', 
          boxShadow: 'xl',
        }}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Box position="relative" paddingTop="100%" overflow="hidden">
          <Image
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            src={image.image_data}
            alt={image.prompt}
            objectFit="cover"
          />
        </Box>
        <CardBody p={4}>
          <VStack align="start" spacing={2} h="100%">
            <Text 
              fontWeight="bold" 
              noOfLines={2}
              fontSize="md"
              color="gray.800"
              _dark={{ color: "gray.100" }}
            >
              {image.prompt}
            </Text>
            
            <Flex width="100%" alignItems="center" mt="auto" pt={2}>
              <Flex alignItems="center" fontSize="xs" color="gray.500">
                <TimeIcon mr={1} />
                <Text>{formatDate(image.created_at)}</Text>
              </Flex>
              
              {image.feedback > 0 && (
                <Badge 
                  colorScheme="green" 
                  ml="auto"
                  borderRadius="full"
                  px={2}
                  display="flex"
                  alignItems="center"
                >
                  <StarIcon mr={1} boxSize={3} />
                  Liked
                </Badge>
              )}
            </Flex>
            
            <Tooltip label={`Seed: ${image.seed}`} placement="top">
              <Badge 
                colorScheme="purple" 
                variant="subtle"
                borderRadius="full"
                px={2}
              >
                #{image.id}
              </Badge>
            </Tooltip>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;
  
  const fetchImages = async (pageNum) => {
    setLoading(true);
    try {
      const data = await getImages(pageSize, pageNum * pageSize);
      
      if (data.length < pageSize) {
        setHasMore(false);
      }
      
      // If it's the first page, replace images, otherwise append
      if (pageNum === 0) {
        setImages(data);
      } else {
        setImages((prevImages) => [...prevImages, ...data]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchImages(page);
  }, [page]);
  
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  
  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  
  return (
    <Box 
      bgGradient="linear(to-br, purple.50, blue.50)"
      _dark={{ bgGradient: "linear(to-br, gray.900, gray.800)" }}
      minH="100vh"
      py={8}
      px={4}
    >
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={4}>
            <Heading 
              as="h1" 
              size="xl" 
              mb={3}
              bgGradient="linear(to-r, purple.600, blue.500)"
              _dark={{ bgGradient: "linear(to-r, purple.300, blue.200)" }}
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              Your Creations
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.300" }}>
              Browse your AI-generated gallery of imagination
            </Text>
          </Box>
          
          {loading && page === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Spinner 
                  size="xl" 
                  thickness="4px"
                  speed="0.7s"
                  color="purple.500"
                />
                <Text color="purple.500" fontWeight="medium">
                  Loading your gallery...
                </Text>
              </VStack>
            </Center>
          ) : images.length === 0 ? (
            <Center py={20}>
              <VStack spacing={6}>
                <Icon as={StarIcon} boxSize={16} color="purple.300" />
                <Text fontSize="xl" fontWeight="medium" color="gray.600" _dark={{ color: "gray.300" }}>
                  No images found in your gallery
                </Text>
                <Button 
                  as={RouterLink} 
                  to="/" 
                  colorScheme="purple"
                  size="lg"
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Create your first image
                </Button>
              </VStack>
            </Center>
          ) : (
            <>
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                spacing={6}
                mt={4}
              >
                {images.map((image) => (
                  <GalleryItem key={image.id} image={image} />
                ))}
              </SimpleGrid>
              
              {(loading && page > 0) && (
                <Center py={6}>
                  <Spinner 
                    color="purple.500"
                    thickness="3px"
                  />
                </Center>
              )}
              
              <Flex justifyContent="center" mt={8} mb={4}>
                <Button
                  leftIcon={<ChevronLeftIcon />}
                  onClick={handlePrevPage}
                  isDisabled={page === 0}
                  mr={4}
                  colorScheme="purple"
                  variant="outline"
                  size="md"
                  borderRadius="lg"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'sm',
                  }}
                  transition="all 0.2s"
                >
                  Previous
                </Button>
                <Button
                  rightIcon={<ChevronRightIcon />}
                  onClick={handleNextPage}
                  isDisabled={!hasMore}
                  isLoading={loading && page > 0}
                  colorScheme="purple"
                  size="md"
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Next
                </Button>
              </Flex>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Gallery;