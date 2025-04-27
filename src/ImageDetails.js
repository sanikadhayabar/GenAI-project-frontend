import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Center,
  useToast,
  Divider,
  SimpleGrid,
  FormControl,
  FormLabel,
  Textarea,
  Flex,
  IconButton,
  Badge,
  useColorModeValue,
  Code,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useClipboard,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  DownloadIcon,
  StarIcon,
  RepeatIcon,
  CopyIcon,
  InfoIcon,
  ChevronRightIcon,
  EditIcon,
  CalendarIcon,
  CheckIcon,
} from '@chakra-ui/icons';
import {
  getImageDetails,
  generateVariations,
  saveFeedback,
} from './api';

const ImageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [variations, setVariations] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // For copy functionality
  const { hasCopied, onCopy } = useClipboard('');
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const promptBg = useColorModeValue('gray.50', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');
  
  useEffect(() => {
    const fetchImageDetails = async () => {
      setLoading(true);
      try {
        const data = await getImageDetails(id);
        setImage(data);
        setPrompt(data.prompt);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch image details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchImageDetails();
  }, [id, toast]);
  
  // Update clipboard content when prompt changes
  useEffect(() => {
    if (image) {
      onCopy.copy = image.prompt;
    }
  }, [image, onCopy]);
  
  const handleDownload = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image.image_data;
    link.download = `image-${id}.png`;
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
  
  const handleCopyPrompt = () => {
    if (!image) return;
    
    navigator.clipboard.writeText(image.prompt);
    
    toast({
      title: 'Prompt Copied',
      description: 'The prompt has been copied to your clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };
  
  const handleLike = async () => {
    if (!image) return;
    
    try {
      await saveFeedback(id, 1);
      setImage({ ...image, feedback: 1 });
      toast({
        title: 'Image Liked',
        description: 'Your feedback has been saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save feedback',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleGenerateVariations = async () => {
    if (!image) return;
    
    setLoadingVariations(true);
    try {
      const results = await generateVariations({
        image: image.image_data,
        prompt: prompt,
        num_variations: 4,
      });
      
      setVariations(results);
      toast({
        title: 'Variations Generated',
        description: 'Image variations have been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate variations',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingVariations(false);
    }
  };
  
  // Function to format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack>
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              variant="outline"
            >
              Back to Gallery
            </Button>
          </HStack>
          
          <Center py={12}>
            <VStack spacing={4}>
              <Spinner size="xl" thickness="4px" color="brand.500" />
              <Text color={mutedColor}>Loading image details...</Text>
            </VStack>
          </Center>
        </VStack>
      </Container>
    );
  }
  
  if (!image) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack>
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              colorScheme="brand"
              variant="outline"
            >
              Back to Gallery
            </Button>
          </HStack>
          
          <Alert 
            status="error" 
            variant="subtle" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            textAlign="center" 
            borderRadius="lg"
            py={8}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <Heading mt={4} mb={2} size="lg">
              Image Not Found
            </Heading>
            <Text mb={6}>
              The requested image could not be found or has been deleted.
            </Text>
            <Button colorScheme="brand" onClick={() => navigate('/')}>
              Generate New Image
            </Button>
          </Alert>
        </VStack>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink 
              href="/"
              color={mutedColor}
              _hover={{ color: accentColor }}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbItem>
            <BreadcrumbLink 
              href="/gallery"
              color={mutedColor}
              _hover={{ color: accentColor }}
            >
              Gallery
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink 
              color={textColor}
              fontWeight="medium"
            >
              Image #{id}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Flex direction={{ base: 'column', lg: 'row' }} gap={8} mb={8}>
          <Box flex="1">
            <Card
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              bg={cardBg}
              borderColor={borderColor}
              boxShadow="md"
              h="100%"
            >
              <CardBody p={0} position="relative">
                <Skeleton isLoaded={imageLoaded} height={!imageLoaded ? "600px" : "auto"}>
                  <Box
                    bg="gray.900"
                    position="relative"
                  >
                    <Image
                      src={image.image_data}
                      alt={image.prompt}
                      width="100%"
                      height="auto"
                      objectFit="contain"
                      onLoad={() => setImageLoaded(true)}
                    />
                  </Box>
                </Skeleton>
                
                {/* Image controls */}
                <HStack
                  position="absolute"
                  bottom="4"
                  right="4"
                  spacing={2}
                >
                  <Tooltip label="Like this image">
                    <IconButton
                      icon={image.feedback > 0 ? <StarIcon /> : <StarIcon />}
                      aria-label="Like image"
                      onClick={handleLike}
                      colorScheme={image.feedback > 0 ? "red" : "gray"}
                      isDisabled={image.feedback > 0}
                      size="lg"
                      borderRadius="full"
                      boxShadow="lg"
                    />
                  </Tooltip>
                  
                  <Tooltip label="Download image">
                    <IconButton
                      icon={<DownloadIcon />}
                      aria-label="Download image"
                      onClick={handleDownload}
                      colorScheme="brand"
                      size="lg"
                      borderRadius="full"
                      boxShadow="lg"
                    />
                  </Tooltip>
                </HStack>
              </CardBody>
            </Card>
          </Box>
          
          <VStack flex="1" align="stretch" spacing={6} minW={{ lg: "400px" }}>
            <Card
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              bg={cardBg}
              borderColor={borderColor}
              boxShadow="sm"
            >
              <CardHeader pb={2}>
                <Heading size="md" display="flex" alignItems="center">
                  <InfoIcon mr={2} color="brand.500" />
                  Image Details
                </Heading>
              </CardHeader>
              
              <CardBody>
                <Tabs colorScheme="brand" size="md" variant="line">
                  <TabList>
                    <Tab fontWeight="medium">
                      <InfoIcon mr={2} />
                      Info
                    </Tab>
                    <Tab fontWeight="medium">
                      <RepeatIcon mr={2} />
                      Variations
                    </Tab>
                  </TabList>
                  
                  <TabPanels>
                    <TabPanel>
                      <VStack align="stretch" spacing={5}>
                        <Box>
                          <Text fontWeight="bold" mb={1} color={mutedColor} fontSize="sm">
                            ID
                          </Text>
                          <Code
                            p={2}
                            borderRadius="md"
                            fontSize="sm"
                            fontFamily="monospace"
                            width="fit-content"
                          >
                            {image.id}
                          </Code>
                        </Box>
                      
                        <Box>
                          <Text fontWeight="bold" mb={1} color={mutedColor} fontSize="sm">
                            PROMPT
                          </Text>
                          <Flex width="100%">
                            <Box
                              flex="1"
                              bg={promptBg}
                              p={3}
                              borderRadius="md"
                              fontSize="sm"
                              fontFamily="system-ui"
                              position="relative"
                              borderWidth="1px"
                              borderColor={borderColor}
                            >
                              <Text>{image.prompt}</Text>
                            </Box>
                            <IconButton
                              icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                              aria-label="Copy prompt"
                              ml={2}
                              onClick={handleCopyPrompt}
                              colorScheme={hasCopied ? "green" : "brand"}
                            />
                          </Flex>
                        </Box>
                        
                        <StatGroup>
                          <Stat>
                            <StatLabel color={mutedColor} fontSize="sm">
                              <HStack>
                                <CalendarIcon />
                                <Text>Created</Text>
                              </HStack>
                            </StatLabel>
                            <StatNumber fontSize="md">
                              {formatDate(image.created_at)}
                            </StatNumber>
                          </Stat>
                          
                          <Stat>
                            <StatLabel color={mutedColor} fontSize="sm">
                              <HStack>
                                <RepeatIcon />
                                <Text>Seed</Text>
                              </HStack>
                            </StatLabel>
                            <StatNumber fontSize="md">
                              {image.seed}
                            </StatNumber>
                          </Stat>
                        </StatGroup>
                        
                        <Box>
                          <Text fontWeight="bold" mb={2} color={mutedColor} fontSize="sm">
                            TAGS
                          </Text>
                          <Flex gap={2} wrap="wrap">
                            <Tag size="md" colorScheme="brand" borderRadius="full">
                              <TagLeftIcon as={EditIcon} />
                              <TagLabel>AI Generated</TagLabel>
                            </Tag>
                            
                            {image.feedback > 0 && (
                              <Tag size="md" colorScheme="green" borderRadius="full">
                                <TagLeftIcon as={StarIcon} />
                                <TagLabel>Liked</TagLabel>
                              </Tag>
                            )}
                            
                            <Tag size="md" colorScheme="purple" borderRadius="full">
                              <TagLeftIcon boxSize="12px" as={InfoIcon} />
                              <TagLabel>Seed: {image.seed.toString().slice(0, 8)}</TagLabel>
                            </Tag>
                          </Flex>
                        </Box>
                      </VStack>
                    </TabPanel>
                    
                    <TabPanel>
                      <VStack align="stretch" spacing={4}>
                        <FormControl>
                          <FormLabel fontWeight="medium">
                            Prompt for Variations
                          </FormLabel>
                          <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            resize="vertical"
                            focusBorderColor="brand.500"
                          />
                        </FormControl>
                        
                        <Button
                          leftIcon={<RepeatIcon />}
                          colorScheme="brand"
                          onClick={handleGenerateVariations}
                          isLoading={loadingVariations}
                          loadingText="Generating..."
                          w="full"
                          size="lg"
                          mt={2}
                          boxShadow="md"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                          transition="all 0.2s"
                        >
                          Generate Variations
                        </Button>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </VStack>
        </Flex>
        
        {variations.length > 0 && (
          <VStack align="stretch" spacing={6}>
            <Divider />
            <Box py={2}>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <RepeatIcon mr={2} color="brand.500" />
                Image Variations
              </Heading>
              
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
                {variations.map((variation) => (
                  <Card
                    key={variation.id}
                    borderWidth="1px"
                    borderRadius="xl"
                    overflow="hidden"
                    bg={cardBg}
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={() => navigate(`/image/${variation.id}`)}
                    transition="all 0.2s"
                    _hover={{ 
                      transform: 'translateY(-5px)', 
                      boxShadow: 'xl',
                      borderColor: 'brand.400'
                    }}
                  >
                    <Box position="relative">
                      <Image
                        src={variation.image}
                        alt={variation.prompt}
                        width="100%"
                        height="auto"
                        borderTopRadius="xl"
                      />
                      <Badge
                        position="absolute"
                        bottom="2"
                        right="2"
                        colorScheme="brand"
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        #{variation.id}
                      </Badge>
                    </Box>
                    
                    <Box p={3}>
                      <Text noOfLines={2} fontSize="sm" color={mutedColor}>
                        Click to view details
                      </Text>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        )}
      </VStack>
      
      <Box position="fixed" bottom="8" left="8" zIndex="tooltip">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          colorScheme="brand"
          boxShadow="lg"
          size="lg"
          borderRadius="full"
          px={6}
        >
          Back to Gallery
        </Button>
      </Box>
    </Container>
  );
};

export default ImageDetails;