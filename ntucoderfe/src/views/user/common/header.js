import {
  Box,
  Flex,
  Image,
  Button,
  useColorModeValue,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import logo from '../../../assets/img/ntu-coders.png';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Cookies from 'js-cookie';
import { useAuth } from 'contexts/AuthContext';
import { useState, useEffect } from 'react';
export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [coderName, setCoderName] = useState('');
  const [roleID, setRoleID] = useState(null);
  const handleLogout = async () => {
    const token = Cookies.get('token');
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await api.post('/Auth/logout', {});
      if (response.status === 200) {
        Cookies.remove('token');
        logout();
      } else {
        console.log('Đăng xuất thất bại');
      }
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error);
    }
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('token');

      if (!token) {
        return;
      }

      try {
        const response = await api.get('/Auth/me');
        if (response.status === 200) {
          const { coderName, roleID } = response.data;
          setCoderName(coderName);
          setRoleID(roleID);
        }
      } catch (error) {
        console.log('Lỗi:', error);
      }
    };

    fetchUserInfo();
  }, []);
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
          ></Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Image src={logo} alt="Logo" width="300px" />
          </Flex>

          <Flex align="center" gap={4}>
            {coderName && roleID !== null ? (
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
