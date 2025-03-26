import { motion } from 'framer-motion';
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
import { Link } from 'react-router-dom';
import api from '../../../utils/api';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export default function Header({ hideHeader }) {
  const [coderName, setCoderName] = useState('');
  const [roleID, setRoleID] = useState(null);
  const [coderID, setCoderID] = useState(null);

  const handleLogout = async () => {
    try {
      await api.post('/Auth/logout', {});
      Cookies.remove('token');
      setCoderName(null);
      setRoleID(null);
      setCoderID(null);
      window.location.reload();
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('token');
      if (!token) return;
      try {
        const response = await api.get('/Auth/me');
        if (response.status === 200) {
          const { coderID, coderName, roleID } = response.data;
          setCoderName(coderName);
          setRoleID(roleID);
          setCoderID(coderID);
        }
      } catch (error) {
        console.log('Lỗi:', error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: hideHeader ? -70 : 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      style={{ position: 'fixed', top: 0, width: '100%', zIndex: 11 }}
    >
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        w="100%"
        minH="70px"
      >
        <Box maxW="1200px" mx="auto">
          <Flex
            color={useColorModeValue('gray.600', 'white')}
            minH="60px"
            py={{ base: 2 }}
            px={0}
          >
            <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
              <Image src={logo} alt="Logo" width="300px" />
            </Flex>
            <Flex align="center" gap={4}>
              {coderName && roleID !== null ? (
                <>
                  <Text fontSize="md" fontWeight="600" color="gray.700">
                    Xin chào, {coderName}
                  </Text>
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
                  <Button
                    onClick={handleLogout}
                    fontSize="md"
                    fontWeight={600}
                    color="white"
                    bg="red.500"
                    _hover={{ bg: 'red.600' }}
                    borderRadius="md"
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
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
                  <Button
                    as={Link}
                    to="/register"
                    fontSize="md"
                    fontWeight={600}
                    color="white"
                    bg="#0186bd"
                    _hover={{ bg: 'blue.700' }}
                    borderRadius="md"
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </motion.div>
  );
}
