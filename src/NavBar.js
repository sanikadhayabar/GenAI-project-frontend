import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack,
  Heading,
  Container,
  Text,
} from '@chakra-ui/react';
import { 
  HamburgerIcon, 
  CloseIcon, 
  MoonIcon, 
  SunIcon,
  StarIcon,
  ViewIcon,
} from '@chakra-ui/icons';

const NavLink = ({ children, to, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      as={RouterLink}
      px={4}
      py={2}
      rounded="full"
      display="flex"
      alignItems="center"
      fontWeight={isActive ? "bold" : "medium"}
      color={isActive ? "white" : "gray.600"}
      bg={isActive ? "purple.500" : "transparent"}
      _hover={{
        textDecoration: 'none',
        bg: isActive ? "purple.600" : "purple.50",
        color: isActive ? "white" : "purple.600",
      }}
      _dark={{
        color: isActive ? "white" : "gray.300",
        bg: isActive ? "purple.500" : "transparent",
        _hover: {
          bg: isActive ? "purple.600" : "gray.700",
          color: isActive ? "white" : "purple.300",
        }
      }}
      transition="all 0.2s"
      to={to}
    >
      {icon && <Box mr={2}>{icon}</Box>}
      {children}
    </Link>
  );
};

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box 
      bg="white"
      _dark={{ bg: "gray.800" }}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container maxW="container.lg">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            colorScheme="purple"
          />
          
          <HStack spacing={8} alignItems="center">
            <Heading
              size="md"
              bgGradient="linear(to-r, purple.600, blue.500)"
              _dark={{ bgGradient: "linear(to-r, purple.300, blue.200)" }}
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              Dream2Reality
            </Heading>
            
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              <NavLink to="/" icon={<StarIcon />}>Create</NavLink>
              <NavLink to="/gallery" icon={<ViewIcon />}>Gallery</NavLink>
            </HStack>
          </HStack>
          
          <Flex alignItems="center">
            <Button 
              onClick={toggleColorMode} 
              size="md"
              variant="ghost"
              colorScheme="purple"
              aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              borderRadius="full"
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={2} pt={2}>
              <NavLink to="/" icon={<StarIcon />}>Create</NavLink>
              <NavLink to="/gallery" icon={<ViewIcon />}>Gallery</NavLink>
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default NavBar;