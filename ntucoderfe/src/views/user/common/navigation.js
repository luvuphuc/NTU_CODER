import { motion } from 'framer-motion';
import {
  Box,
  Flex,
  Button,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import routes from 'routes.js';
import { useState, useEffect } from 'react';

export default function Navigation({ hideHeader }) {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: 70 }}
      animate={{ y: hideHeader ? 0 : 70 }}
      transition={{ type: 'tween', duration: 0.3 }}
      style={{ position: 'fixed', width: '100%', zIndex: 10 }}
    >
      <Box
        bg="#0186bd"
        w="100%"
        py={3}
        borderBottom="1px solid"
        borderColor="#0170a3"
        boxShadow={isScrolled ? 'lg' : 'none'}
      >
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
          <Flex justify="space-between" align="center">
            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'block', md: 'none' }}
              icon={<HamburgerIcon />}
              onClick={onOpen}
              color="white"
              variant="ghost"
              aria-label="Open menu"
            />

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {routes
                .filter((route) => route.layout === '/user')
                .map((route) => {
                  const isActive =
                    route.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(route.path);
                  return (
                    <Link to={route.path} key={route.path}>
                      <Button
                        variant="link"
                        fontWeight="500"
                        fontSize="md"
                        px={4}
                        py={2}
                        _hover={{ textDecoration: 'none' }}
                        color={isActive ? '#0186bd' : 'white'}
                        bg={isActive ? 'white' : 'transparent'}
                        borderRadius="10"
                      >
                        {route.icon} {route.name}
                      </Button>
                    </Link>
                  );
                })}
            </Stack>

            {/* Search Input (Desktop Only) */}
            <InputGroup maxW="250px" display={{ base: 'none', md: 'block' }}>
              <Input placeholder="Tìm kiếm..." bg="white" color="black" />
              <InputRightElement>
                <IconButton
                  aria-label="Tìm kiếm"
                  icon={<SearchIcon />}
                  size="sm"
                  bg="transparent"
                  _hover={{ bg: 'gray.200' }}
                />
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Box>

        {/* Mobile Drawer Navigation */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent
            bg="white"
            color="gray.800"
            borderRadius="lg"
            boxShadow="xl"
            maxW="280px"
          >
            <DrawerHeader
              borderBottomWidth="1px"
              fontSize="xl"
              fontWeight="bold"
              bg="#0186bd"
              color="white"
              borderTopRadius="lg"
            >
              Menu
              <IconButton
                aria-label="Close menu"
                icon={<CloseIcon />}
                onClick={onClose}
                variant="ghost"
                ml="auto"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
              />
            </DrawerHeader>
            <DrawerBody p={4}>
              <Stack spacing={4}>
                {routes
                  .filter((route) => route.layout === '/user')
                  .map((route) => (
                    <Link to={route.path} key={route.path} onClick={onClose}>
                      <Button
                        w="100%"
                        justifyContent="start"
                        fontSize="lg"
                        fontWeight="500"
                        color="gray.700"
                        bg="gray.100"
                        _hover={{ bg: 'gray.200', transform: 'scale(1.05)' }}
                        transition="all 0.2s ease-in-out"
                        p={4}
                        borderRadius="lg"
                      >
                        {route.icon} {route.name}
                      </Button>
                    </Link>
                  ))}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </motion.div>
  );
}
