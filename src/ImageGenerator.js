import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  Textarea,
  VStack,
  HStack,
  Image,
  useToast,
  Text,
  Flex,
  Spacer,
  IconButton,
  Badge,
  Card,
  CardBody,
  useColorModeValue,
  Skeleton,
  Icon,
} from '@chakra-ui/react';
import { 
  DownloadIcon, 
  StarIcon, 
  InfoIcon, 
  ChevronRightIcon,
  MoonIcon,
} from '@chakra-ui/icons';
import { generateImage } from './api';

// Example prompts to inspire users
const EXAMPLE_PROMPTS = [
  "A serene mountain landscape at dawn with misty valleys and golden light",
  "A cyberpunk cityscape with neon lights and flying vehicles",
  "A magical forest with glowing mushrooms and fairy lights",
  "An underwater scene with coral reefs and tropical fish",
  "A futuristic laboratory with holographic displays and robots"
];

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [inferenceSteps, setInferenceSteps] = useState(50);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  
  const toast = useToast();
  const navigate = useNavigate();
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, blue.50)',
    'linear(to-br, gray.900, gray.800)'
  );
  const promptBg = useColorModeValue('white', 'gray.700');
  const gradientText = useColorModeValue(
    'linear(to-r, purple.600, blue.500)',
    'linear(to-r, purple.300, blue.200)'
  );

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Missing Input',
        description: 'Please enter a text prompt to generate an image',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
  
    setLoading(true);
    
    try {
      const seedValue = seed ? parseInt(seed) : undefined;
      
      // Enhanced prompt for anime/cartoon style
      const enhancedPrompt = `${prompt}, anime style, cartoon art, detailed illustration, vibrant colors, Naruto-inspired`;
      
      // Additional style parameters
      const styleParams = {
        style_preset: "anime",
        art_style: "cartoon",
        quality: "hd"
      };
      
      const result = await generateImage({
        // Use the enhanced prompt instead of the original
        prompt: enhancedPrompt,
        negative_prompt: `realistic, photorealistic, 3d render, photograph, ${negativePrompt}`,
        num_inference_steps: inferenceSteps,
        guidance_scale: guidanceScale,
        seed: seedValue,
        // Include style parameters
        ...styleParams
      });
      
      setGeneratedImage(result.image);
      setImageId(result.id);
      setSeed(result.seed.toString());
      
      toast({
        title: 'Success!',
        description: 'Your anime-style image has been generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate image. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 4294967295).toString());
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Image Downloaded',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  const handleViewDetails = () => {
    if (imageId) {
      navigate(`/image/${imageId}`);
    }
  };
  
  const handleUseExamplePrompt = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  return (
    <Box 
      bgGradient={bgGradient}
      minH="100vh"
      py={8}
      px={4}
    >
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={2}>
            <Heading 
              as="h1" 
              size="2xl" 
              mb={3}
              bgGradient={gradientText}
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              Dream to Reality
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.300" }} maxW="container.md" mx="auto">
              Transform your imagination into stunning visuals with AI
            </Text>
          </Box>
          
          {/* Prompt Input and Generate Button (Side by Side) */}
          <Flex 
            direction={{ base: "column", md: "row" }} 
            gap={4}
            align="stretch"
          >
            <FormControl flex="1">
              <Textarea
                placeholder="Describe the image you want to generate in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                size="lg"
                bg={promptBg}
                borderRadius="lg"
                borderColor={borderColor}
                focusBorderColor="purple.400"
                _hover={{ borderColor: 'purple.300' }}
                resize="vertical"
                fontSize="md"
                p={4}
                height="80px"
              />
              
              <Flex wrap="wrap" gap={2} mt={2}>
                {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
                  <Badge
                    key={index}
                    px={2}
                    py={1}
                    borderRadius="full"
                    colorScheme="purple"
                    cursor="pointer"
                    _hover={{ bg: 'purple.100', color: 'purple.800' }}
                    onClick={() => handleUseExamplePrompt(examplePrompt)}
                  >
                    {examplePrompt.slice(0, 25)}...
                  </Badge>
                ))}
              </Flex>
            </FormControl>
            
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleGenerateImage}
              isLoading={loading}
              loadingText="Creating..."
              leftIcon={<StarIcon />}
              minW={{ base: "full", md: "150px" }}
              h="80px"
              borderRadius="lg"
              fontWeight="bold"
              boxShadow="md"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              Generate
            </Button>
          </Flex>
          
          {/* Image Display Area */}
          <Card 
            bg={cardBg} 
            borderRadius="xl"
            boxShadow="xl"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
            mt={4}
          >
            <CardBody p={6}>
              <Box
                borderRadius="lg"
                overflow="hidden"
                bg="gray.100"
                _dark={{ bg: "gray.700" }}
                h={{ base: "300px", md: "400px", lg: "500px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                {/* Loading state */}
                {loading && (
                  <VStack spacing={4}>
                    <Skeleton height="100%" width="100%" startColor="purple.100" endColor="blue.200" />
                    <Text color="purple.500" fontWeight="medium">
                      Creating your masterpiece...
                    </Text>
                  </VStack>
                )}
                
                {/* Generated image state */}
                {!loading && generatedImage && (
                  <Image
                    src={generatedImage}
                    alt="Generated image"
                    maxH="100%"
                    maxW="100%"
                    objectFit="contain"
                    borderRadius="md"
                  />
                )}
                
                {/* Empty state */}
                {!loading && !generatedImage && (
                  <VStack spacing={6} p={6} textAlign="center">
                    <Icon as={MoonIcon} boxSize={16} color="purple.300" />
                    <VStack spacing={2}>
                      <Text color="gray.600" fontWeight="medium" fontSize="lg" _dark={{ color: "gray.300" }}>
                        Your creation will appear here
                      </Text>
                      <Text color="gray.500" fontSize="sm" _dark={{ color: "gray.400" }}>
                        Describe your vision and click "Generate"
                      </Text>
                    </VStack>
                  </VStack>
                )}
              </Box>
              
              {/* Action buttons (only shown when image is generated) */}
              {generatedImage && (
                <Flex justify="flex-end" mt={4} gap={3}>
                  <Button
                    leftIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    colorScheme="green"
                    size="md"
                    borderRadius="lg"
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                  >
                    Download
                  </Button>
                  
                  <Button
                    rightIcon={<ChevronRightIcon />}
                    onClick={handleViewDetails}
                    colorScheme="purple"
                    size="md"
                    variant="outline"
                    borderRadius="lg"
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'sm',
                    }}
                  >
                    View Details
                  </Button>
                </Flex>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default ImageGenerator;