import {
  Box,
  Flex,
  Image,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useDisclosure,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '../../../assets/img/ntu-coders.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from '../../../redux/slices/authSlice';
export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const roleID = useSelector((state) => state.auth.roleID);
  const coderName = useSelector((state) => state.auth.coderName);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const token = Cookies.get('token');

    if (!token) {
      dispatch(logout());
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(
        '/Auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        Cookies.remove('token');
        dispatch(logout());
      } else {
        console.log('Đăng xuất thất bại');
      }
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      w="100%"
    >
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 4 }}>
        <Flex
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}
          justify="space-between"
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Image src={logo} alt="Logo" width="300px" />
          </Flex>

          <Flex align="center" gap={4}>
            {user ? (
              <>
                {/* Chào user */}
                {coderName && (
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color="gray.700"
                    whiteSpace="nowrap"
                  >
                    Xin chào, {coderName}
                  </Text>
                )}

                {/* Link admin */}
                {roleID === 1 && (
                  <ChakraLink
                    as={Link}
                    to="/admin"
                    fontSize="md"
                    fontWeight={600}
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Trang quản trị
                  </ChakraLink>
                )}

                {/* Logout */}
                <Button
                  onClick={handleLogout}
                  fontSize="md"
                  fontWeight={600}
                  color="white"
                  bg="red.500"
                  _hover={{ bg: 'red.600' }}
                  borderRadius="md"
                  px={4}
                  py={2}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                {/* Login */}
                <ChakraLink
                  as={Link}
                  to="/login"
                  fontSize="md"
                  fontWeight={500}
                  color="gray.600"
                  _hover={{ color: 'blue.500' }}
                >
                  Đăng nhập
                </ChakraLink>

                {/* Register */}
                <Button
                  as={Link}
                  to="/register"
                  fontSize="md"
                  fontWeight={600}
                  color="white"
                  bg="#0186bd"
                  _hover={{ bg: 'blue.700' }}
                  borderRadius="md"
                  px={4}
                  py={2}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
